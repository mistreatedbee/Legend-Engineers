import { pool, ensureSchema } from '../db.js';
import { assertSameOrigin, hashPassword, requireAdmin, verifyPassword } from '../auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  await ensureSchema();

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, admin });
  }

  if (req.method === 'PUT') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });

    const { currentPassword, newPassword, name } = req.body || {};

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ ok: false, error: 'Current password is required to set a new password.' });
      }
      if (String(newPassword).length < 8) {
        return res.status(400).json({ ok: false, error: 'New password must be at least 8 characters.' });
      }
      const { rows } = await pool.query('SELECT * FROM admin_users WHERE id = $1', [admin.id]);
      const valid = rows[0] && (await verifyPassword(currentPassword, rows[0].password_hash));
      if (!valid) {
        return res.status(401).json({ ok: false, error: 'Current password is incorrect.' });
      }
      const passwordHash = await hashPassword(newPassword);
      await pool.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [passwordHash, admin.id]);
    }

    if (typeof name === 'string' && name.trim()) {
      await pool.query('UPDATE admin_users SET name = $1 WHERE id = $2', [name.trim(), admin.id]);
    }

    const { rows: updated } = await pool.query(
      'SELECT id, email, name FROM admin_users WHERE id = $1',
      [admin.id]
    );
    return res.status(200).json({ ok: true, admin: updated[0] });
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
