import { pool } from '../_lib/db.js';
import {
  assertSameOrigin,
  checkLoginRateLimit,
  ensureDefaultAdmin,
  recordLoginAttempt,
  requireAdmin,
  setSessionCookie,
  signToken,
  verifyPassword,
} from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (!assertSameOrigin(req)) {
      return res.status(403).json({ ok: false, error: 'Invalid origin' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress;
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Email and password are required.' });
    }

    await ensureDefaultAdmin();
    const allowed = await checkLoginRateLimit(ip, email);
    if (!allowed) {
      return res.status(429).json({ ok: false, error: 'Too many login attempts. Try again later.' });
    }

    const { rows } = await pool.query('SELECT * FROM admin_users WHERE email = $1', [
      email.toLowerCase().trim(),
    ]);
    const user = rows[0];
    const valid = user && (await verifyPassword(password, user.password_hash));
    await recordLoginAttempt(ip, email, valid);

    if (!valid) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
    }

    await pool.query('UPDATE admin_users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    const token = signToken(user);
    setSessionCookie(res, token);
    return res.status(200).json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  }

  if (req.method === 'GET') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    return res.status(200).json({ ok: true, user: admin });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
