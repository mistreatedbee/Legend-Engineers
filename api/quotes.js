import { pool, ensureSchema } from './_lib/db.js';
import { sendMail, rowHtml } from './_lib/mail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { name, company, email, phone, serviceType, location, gps, scope, notes } =
    req.body || {};

  if (!name || !email || !serviceType) {
    return res.status(400).json({ ok: false, error: 'Name, email and service are required.' });
  }

  const saveToDb = (async () => {
    await ensureSchema();
    await pool.query(
      `INSERT INTO quote_requests
         (name, company, email, phone, service_type, location, gps_coordinates, scope, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [name, company || null, email, phone || null, serviceType,
       location || null, gps || null, scope || null, notes || null]
    );
  })();

  const notify = sendMail(
    `[New Quote] ${name} — ${serviceType}`,
    [
      rowHtml('Name', name),
      rowHtml('Company', company),
      rowHtml('Email', email),
      rowHtml('Phone', phone),
      rowHtml('Service', serviceType),
      rowHtml('Location', location),
      rowHtml('GPS Coordinates', gps),
      rowHtml('Project Scope', scope),
      rowHtml('Additional Notes', notes),
    ].join('')
  );

  const [db, mail] = await Promise.allSettled([saveToDb, notify]);

  if (db.status === 'rejected') console.error('Quote DB error:', db.reason?.message);
  if (mail.status === 'rejected') console.error('Quote email error:', mail.reason?.message);

  if (db.status === 'fulfilled' || mail.status === 'fulfilled') {
    return res.status(200).json({
      ok: true,
      stored: db.status === 'fulfilled',
      emailed: mail.status === 'fulfilled',
    });
  }

  return res.status(500).json({ ok: false, error: 'Failed to save quote request.' });
}
