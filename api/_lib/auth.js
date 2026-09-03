import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, ensureSchema } from './db.js';

const COOKIE_NAME = 'admin_session';
const SESSION_HOURS = 8;

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error('ADMIN_JWT_SECRET is not configured');
  return secret;
}

export function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const idx = c.indexOf('=');
        if (idx === -1) return [c, ''];
        return [c.slice(0, idx), decodeURIComponent(c.slice(idx + 1))];
      })
  );
}

export function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}${secure}`
  );
}

export function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`
  );
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name || '' },
    getSecret(),
    { expiresIn: `${SESSION_HOURS}h` }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function ensureDefaultAdmin() {
  await ensureSchema();
  const { rows } = await pool.query('SELECT id FROM admin_users LIMIT 1');
  if (rows.length) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const passwordHash = await hashPassword(password);
  await pool.query(
    'INSERT INTO admin_users (email, password_hash, name) VALUES ($1,$2,$3)',
    [email.toLowerCase().trim(), passwordHash, 'Administrator']
  );
}

export async function checkLoginRateLimit(ip, email) {
  await ensureSchema();
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM login_attempts
     WHERE attempted_at > NOW() - INTERVAL '15 minutes'
       AND (ip = $1 OR email = $2)`,
    [ip || 'unknown', (email || '').toLowerCase()]
  );
  return rows[0].count < 8;
}

export async function recordLoginAttempt(ip, email, success) {
  await pool.query(
    'INSERT INTO login_attempts (ip, email, success) VALUES ($1,$2,$3)',
    [ip || 'unknown', (email || '').toLowerCase(), success]
  );
}

export function getTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  if (cookies[COOKIE_NAME]) return cookies[COOKIE_NAME];
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export async function getAdminFromRequest(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload?.sub) return null;

  await ensureSchema();
  const { rows } = await pool.query(
    'SELECT id, email, name FROM admin_users WHERE id = $1',
    [payload.sub]
  );
  return rows[0] || null;
}

export async function requireAdmin(req, res) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    res.status(401).json({ ok: false, error: 'Unauthorized' });
    return null;
  }
  return admin;
}

export function assertSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return true;
  try {
    const url = new URL(origin);
    return url.host === host;
  } catch {
    return false;
  }
}
