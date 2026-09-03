import { pool, ensureSchema } from '../db.js';
import { assertSameOrigin, requireAdmin } from '../auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  await ensureSchema();

  if (req.method === 'GET') {
    const { status, type } = req.query || {};
    const bookings = await pool.query(`
      SELECT id, 'booking' AS type, full_name AS name, email, phone,
             service AS subject, description AS message, COALESCE(status,'new') AS status, created_at
      FROM booking_requests
      ORDER BY created_at DESC
    `);
    const quotes = await pool.query(`
      SELECT id, 'quote' AS type, name, email, phone,
             service_type AS subject, scope AS message, COALESCE(status,'new') AS status, created_at
      FROM quote_requests
      ORDER BY created_at DESC
    `);

    let items = [...bookings.rows, ...quotes.rows];
    if (type && type !== 'all') items = items.filter((i) => i.type === type);
    if (status && status !== 'all') items = items.filter((i) => i.status === status);
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return res.status(200).json({ ok: true, queries: items });
  }

  if (req.method === 'PUT') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });
    const { type, id, status } = req.body || {};
    if (!type || !id || !status) {
      return res.status(400).json({ ok: false, error: 'Type, id and status are required.' });
    }
    const table = type === 'booking' ? 'booking_requests' : 'quote_requests';
    await pool.query(`UPDATE ${table} SET status = $1 WHERE id = $2`, [status, id]);
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
