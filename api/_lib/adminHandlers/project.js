import { pool, ensureSchema } from '../db.js';
import { assertSameOrigin, requireAdmin } from '../auth.js';
import { uniqueSlug } from '../slug.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const id = Number(req.query?.id);
  if (!id) return res.status(400).json({ ok: false, error: 'Project id is required.' });

  await ensureSchema();

  if (req.method === 'GET') {
    const { rows } = await pool.query(
      `SELECT p.*, COALESCE(
        json_agg(json_build_object('id', pi.id, 'url', pi.image_url, 'storagePath', pi.storage_path, 'altText', pi.alt_text, 'displayOrder', pi.display_order)
          ORDER BY pi.display_order, pi.id) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
       FROM projects p
       LEFT JOIN project_images pi ON pi.project_id = p.id
       WHERE p.id = $1 AND p.deleted_at IS NULL
       GROUP BY p.id`,
      [id]
    );
    if (!rows[0]) return res.status(404).json({ ok: false, error: 'Project not found' });
    return res.status(200).json({ ok: true, project: rows[0] });
  }

  if (req.method === 'PUT') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });
    const body = req.body || {};
    const existing = await pool.query('SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (!existing.rows[0]) return res.status(404).json({ ok: false, error: 'Project not found' });

    const status = body.status ?? existing.rows[0].status;
    const slug = body.slug
      ? await uniqueSlug(pool, 'projects', body.slug, id)
      : existing.rows[0].slug;

    const { rows } = await pool.query(
      `UPDATE projects SET
        slug = $1, title = $2, client = $3, location = $4, category = $5, company = $6, services = $7,
        short_description = $8, description = $9, scope = $10, completion_date = $11, project_value = $12,
        po_number = $13, contract_number = $14, gps_coords = $15, site_area = $16, cover_image = $17,
        featured = $18, status = $19, display_order = $20,
        published_at = CASE WHEN $19 = 'published' AND published_at IS NULL THEN NOW() ELSE published_at END,
        updated_by = $21, updated_at = NOW()
       WHERE id = $22
       RETURNING *`,
      [
        slug,
        body.title ?? existing.rows[0].title,
        body.client ?? existing.rows[0].client,
        body.location ?? existing.rows[0].location,
        body.category ?? existing.rows[0].category,
        body.company ?? existing.rows[0].company,
        body.services ?? existing.rows[0].services,
        body.shortDescription ?? existing.rows[0].short_description,
        body.description ?? existing.rows[0].description,
        JSON.stringify(body.scope ?? existing.rows[0].scope ?? []),
        body.completionDate ?? existing.rows[0].completion_date,
        body.projectValue ?? existing.rows[0].project_value,
        body.poNumber ?? existing.rows[0].po_number,
        body.contractNumber ?? existing.rows[0].contract_number,
        body.gpsCoords ?? existing.rows[0].gps_coords,
        body.siteArea ?? existing.rows[0].site_area,
        body.coverImage ?? existing.rows[0].cover_image,
        body.featured ?? existing.rows[0].featured,
        status,
        body.displayOrder ?? existing.rows[0].display_order,
        admin.id,
        id,
      ]
    );

    if (Array.isArray(body.images)) {
      await pool.query('DELETE FROM project_images WHERE project_id = $1', [id]);
      for (const [idx, img] of body.images.entries()) {
        if (!img?.url) continue;
        await pool.query(
          `INSERT INTO project_images (project_id, image_url, storage_path, alt_text, display_order)
           VALUES ($1,$2,$3,$4,$5)`,
          [id, img.url, img.storagePath || null, img.altText || null, idx]
        );
      }
    }

    return res.status(200).json({ ok: true, project: rows[0] });
  }

  if (req.method === 'DELETE') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });
    const hard = req.query?.hard === 'true';
    if (hard) {
      await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    } else {
      await pool.query(
        `UPDATE projects SET status = 'archived', deleted_at = NOW(), updated_by = $1, updated_at = NOW() WHERE id = $2`,
        [admin.id, id]
      );
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
