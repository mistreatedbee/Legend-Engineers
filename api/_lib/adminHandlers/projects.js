import { pool, ensureSchema } from '../db.js';
import { assertSameOrigin, requireAdmin } from '../auth.js';
import { uniqueSlug } from '../slug.js';
import { importLegacyProjects } from '../projects.js';

function buildProjectFilters(query) {
  const where = ['p.deleted_at IS NULL'];
  const params = [];

  if (query.status && query.status !== 'all') {
    params.push(query.status);
    where.push(`p.status = $${params.length}`);
  }
  if (query.featured === 'true') where.push('p.featured = true');
  if (query.category) {
    params.push(query.category);
    where.push(`p.category = $${params.length}`);
  }
  if (query.year) {
    params.push(`%${query.year}%`);
    where.push(`p.completion_date ILIKE $${params.length}`);
  }
  if (query.q) {
    params.push(`%${query.q}%`);
    where.push(`(p.title ILIKE $${params.length} OR p.client ILIKE $${params.length} OR p.location ILIKE $${params.length})`);
  }

  let orderBy = 'p.updated_at DESC';
  if (query.sort === 'newest') orderBy = 'p.created_at DESC';
  if (query.sort === 'oldest') orderBy = 'p.created_at ASC';
  if (query.sort === 'az') orderBy = 'p.title ASC';
  if (query.sort === 'updated') orderBy = 'p.updated_at DESC';

  return { where: where.join(' AND '), params, orderBy };
}

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  await ensureSchema();

  if (req.method === 'GET') {
    const { where, params, orderBy } = buildProjectFilters(req.query || {});
    const { rows } = await pool.query(
      `SELECT p.*, COALESCE(
        json_agg(json_build_object('id', pi.id, 'url', pi.image_url, 'altText', pi.alt_text, 'displayOrder', pi.display_order)
          ORDER BY pi.display_order, pi.id) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
       FROM projects p
       LEFT JOIN project_images pi ON pi.project_id = p.id
       WHERE ${where}
       GROUP BY p.id
       ORDER BY ${orderBy}`,
      params
    );
    return res.status(200).json({ ok: true, projects: rows });
  }

  if (req.method === 'POST') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });

    if (req.body?.action === 'import-legacy') {
      const imported = await importLegacyProjects(admin.id);
      return res.status(200).json({ ok: true, imported });
    }

    const body = req.body || {};
    if (!body.title || !body.category || !body.description || !body.coverImage) {
      return res.status(400).json({ ok: false, error: 'Title, category, description and cover image are required.' });
    }

    const slug = await uniqueSlug(pool, 'projects', body.slug || body.title);
    const status = body.status || 'draft';
    const { rows } = await pool.query(
      `INSERT INTO projects (
        slug, title, client, location, category, company, services, short_description, description,
        scope, completion_date, project_value, po_number, contract_number, gps_coords, site_area,
        cover_image, featured, status, display_order, published_at, created_by, updated_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$22)
      RETURNING *`,
      [
        slug,
        body.title,
        body.client || null,
        body.location || null,
        body.category,
        body.company || null,
        body.services || null,
        body.shortDescription || body.description.slice(0, 220),
        body.description,
        JSON.stringify(body.scope || []),
        body.completionDate || null,
        body.projectValue || null,
        body.poNumber || null,
        body.contractNumber || null,
        body.gpsCoords || null,
        body.siteArea || null,
        body.coverImage,
        Boolean(body.featured),
        status,
        Number(body.displayOrder || 0),
        status === 'published' ? new Date() : null,
        admin.id,
      ]
    );

    const project = rows[0];
    if (Array.isArray(body.images)) {
      for (const [idx, img] of body.images.entries()) {
        if (!img?.url) continue;
        await pool.query(
          `INSERT INTO project_images (project_id, image_url, storage_path, alt_text, display_order)
           VALUES ($1,$2,$3,$4,$5)`,
          [project.id, img.url, img.storagePath || null, img.altText || null, idx]
        );
      }
    }

    return res.status(201).json({ ok: true, project });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
