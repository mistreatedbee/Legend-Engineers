import { pool, ensureSchema } from '../db.js';
import { assertSameOrigin, requireAdmin } from '../auth.js';
import { uniqueSlug } from '../slug.js';
import { importLegacyJobs } from '../legacyJobs.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  await ensureSchema();

  if (req.method === 'GET') {
    const { status, q } = req.query || {};
    const where = ['deleted_at IS NULL'];
    const params = [];
    if (status && status !== 'all') {
      params.push(status);
      where.push(`status = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      where.push(`(title ILIKE $${params.length} OR department ILIKE $${params.length})`);
    }
    const { rows } = await pool.query(
      `SELECT * FROM jobs WHERE ${where.join(' AND ')} ORDER BY updated_at DESC`,
      params
    );
    return res.status(200).json({ ok: true, jobs: rows });
  }

  if (req.method === 'POST') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });

    if (req.body?.action === 'import-legacy') {
      const imported = await importLegacyJobs(pool, admin.id);
      return res.status(200).json({ ok: true, imported });
    }

    const body = req.body || {};
    if (!body.title || !body.location || !body.employmentType || !body.description) {
      return res.status(400).json({ ok: false, error: 'Required job fields are missing.' });
    }
    const slug = await uniqueSlug(pool, 'jobs', body.slug || body.title);
    const status = body.status || 'draft';
    const { rows } = await pool.query(
      `INSERT INTO jobs (
        slug, title, department, location, employment_type, description, responsibilities,
        requirements, qualifications, experience, closing_date, application_email, status,
        display_order, published_at, created_by, updated_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$16)
      RETURNING *`,
      [
        slug,
        body.title,
        body.department || null,
        body.location,
        body.employmentType,
        body.description,
        body.responsibilities || null,
        JSON.stringify(body.requirements || []),
        body.qualifications || null,
        body.experience || null,
        body.closingDate || null,
        body.applicationEmail || null,
        status,
        Number(body.displayOrder || 0),
        status === 'open' ? new Date() : null,
        admin.id,
      ]
    );
    return res.status(201).json({ ok: true, job: rows[0] });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
