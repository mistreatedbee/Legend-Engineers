import { pool, ensureSchema } from '../db.js';
import { assertSameOrigin, requireAdmin } from '../auth.js';
import { uniqueSlug } from '../slug.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const id = Number(req.query?.id);
  if (!id) return res.status(400).json({ ok: false, error: 'Job id is required.' });

  await ensureSchema();

  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (!rows[0]) return res.status(404).json({ ok: false, error: 'Job not found' });
    return res.status(200).json({ ok: true, job: rows[0] });
  }

  if (req.method === 'PUT') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });
    const body = req.body || {};
    const existing = await pool.query('SELECT * FROM jobs WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (!existing.rows[0]) return res.status(404).json({ ok: false, error: 'Job not found' });

    const status = body.status ?? existing.rows[0].status;
    const slug = body.slug
      ? await uniqueSlug(pool, 'jobs', body.slug, id)
      : existing.rows[0].slug;

    const { rows } = await pool.query(
      `UPDATE jobs SET
        slug = $1, title = $2, department = $3, location = $4, employment_type = $5,
        description = $6, responsibilities = $7, requirements = $8, qualifications = $9,
        experience = $10, closing_date = $11, application_email = $12, status = $13,
        display_order = $14,
        published_at = CASE WHEN $13 = 'open' AND published_at IS NULL THEN NOW() ELSE published_at END,
        updated_by = $15, updated_at = NOW()
       WHERE id = $16 RETURNING *`,
      [
        slug,
        body.title ?? existing.rows[0].title,
        body.department ?? existing.rows[0].department,
        body.location ?? existing.rows[0].location,
        body.employmentType ?? existing.rows[0].employment_type,
        body.description ?? existing.rows[0].description,
        body.responsibilities ?? existing.rows[0].responsibilities,
        JSON.stringify(body.requirements ?? existing.rows[0].requirements ?? []),
        body.qualifications ?? existing.rows[0].qualifications,
        body.experience ?? existing.rows[0].experience,
        body.closingDate ?? existing.rows[0].closing_date,
        body.applicationEmail ?? existing.rows[0].application_email,
        status,
        body.displayOrder ?? existing.rows[0].display_order,
        admin.id,
        id,
      ]
    );
    return res.status(200).json({ ok: true, job: rows[0] });
  }

  if (req.method === 'DELETE') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });
    const hard = req.query?.hard === 'true';
    if (hard) {
      await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
    } else {
      await pool.query(
        `UPDATE jobs SET status = 'archived', deleted_at = NOW(), updated_by = $1, updated_at = NOW() WHERE id = $2`,
        [admin.id, id]
      );
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
