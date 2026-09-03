import { pool, ensureSchema } from './_lib/db.js';
import { withErrorHandling } from './_lib/withErrorHandling.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  await ensureSchema();
  const { rows } = await pool.query(`
    SELECT id, slug, title, department, location, employment_type, description,
           requirements, closing_date, status, display_order, published_at
    FROM jobs
    WHERE deleted_at IS NULL AND status = 'open'
      AND (closing_date IS NULL OR closing_date >= CURRENT_DATE)
    ORDER BY display_order DESC, published_at DESC NULLS LAST, id DESC
  `);

  const jobs = rows.map((row) => ({
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.employment_type,
    description: row.description,
    requirements: row.requirements || [],
    closingDate: row.closing_date,
    status: 'Open',
  }));

  return res.status(200).json({ ok: true, jobs });
}

export default withErrorHandling(handler);
