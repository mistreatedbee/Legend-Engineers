import { pool, ensureSchema } from '../_lib/db.js';
import { assertSameOrigin, requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const id = Number(req.query?.id);
  if (!id) return res.status(400).json({ ok: false, error: 'Application id is required.' });

  await ensureSchema();

  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM career_applications WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ ok: false, error: 'Application not found' });
    return res.status(200).json({ ok: true, application: rows[0] });
  }

  if (req.method === 'PUT') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });
    const { status, internalNotes } = req.body || {};
    const { rows } = await pool.query(
      `UPDATE career_applications
       SET status = COALESCE($1, status),
           internal_notes = COALESCE($2, internal_notes)
       WHERE id = $3
       RETURNING *`,
      [status || null, internalNotes ?? null, id]
    );
    if (!rows[0]) return res.status(404).json({ ok: false, error: 'Application not found' });
    return res.status(200).json({ ok: true, application: rows[0] });
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
