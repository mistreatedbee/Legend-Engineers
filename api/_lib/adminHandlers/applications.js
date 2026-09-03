import { pool, ensureSchema } from '../db.js';
import { requireAdmin } from '../auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  await ensureSchema();

  if (req.method === 'GET') {
    const { status, q } = req.query || {};
    const where = ['1=1'];
    const params = [];
    if (status && status !== 'all') {
      params.push(status);
      where.push(`status = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      where.push(`(full_name ILIKE $${params.length} OR position ILIKE $${params.length} OR email ILIKE $${params.length})`);
    }
    const { rows } = await pool.query(
      `SELECT id, full_name, position, email, phone, location, experience, linkedin,
              status, cv_filename, cv_url, created_at
       FROM career_applications
       WHERE ${where.join(' AND ')}
       ORDER BY created_at DESC`,
      params
    );
    return res.status(200).json({ ok: true, applications: rows });
  }

  res.setHeader('Allow', 'GET');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
