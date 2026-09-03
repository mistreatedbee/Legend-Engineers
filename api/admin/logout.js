import { assertSameOrigin, clearSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!assertSameOrigin(req)) {
    return res.status(403).json({ ok: false, error: 'Invalid origin' });
  }

  // Always clear the cookie, even if the session was already invalid/expired —
  // logout must be idempotent and never require a valid session to succeed.
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
}
