import { pool, ensureSchema } from '../_lib/db.js';
import { assertSameOrigin, requireAdmin } from '../_lib/auth.js';

const DEFAULT_SETTINGS = {
  companyName: 'Enerdge Group / Legend Engineers',
  contactEmail: 'enerdgegroup@gmail.com',
  queriesEmail: 'enerdgegroup@gmail.com',
  phone: '+27 73 881 5050',
  whatsapp: '27738815050',
  address: 'Aldrin St. #2, Reyno Manor, Witbank (eMalahleni), 1035, Mpumalanga, South Africa',
  linkedIn: '',
  facebook: '',
};

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  await ensureSchema();

  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT key, value FROM site_settings');
    const settings = { ...DEFAULT_SETTINGS };
    for (const row of rows) settings[row.key] = row.value;
    return res.status(200).json({ ok: true, settings });
  }

  if (req.method === 'PUT') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });
    const body = req.body || {};
    for (const [key, value] of Object.entries(body)) {
      if (typeof value !== 'string') continue;
      await pool.query(
        `INSERT INTO site_settings (key, value, updated_at) VALUES ($1,$2,NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, value]
      );
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
