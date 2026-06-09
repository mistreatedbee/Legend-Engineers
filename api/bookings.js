import { pool, ensureSchema } from './_lib/db.js';
import { sendMail, rowHtml } from './_lib/mail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const {
    fullName, company, email, phone, service,
    preferredDate, location, gps, urgency, siteArea, description, notes,
  } = req.body || {};

  if (!fullName || !email || !phone || !service || !location) {
    return res.status(400).json({ ok: false, error: 'Please complete all required fields.' });
  }

  const saveToDb = (async () => {
    await ensureSchema();
    await pool.query(
      `INSERT INTO booking_requests
        (full_name, company, email, phone, service, preferred_date,
         location, gps_coordinates, urgency, site_area, description, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        fullName, company || null, email, phone, service,
        preferredDate || null, location, gps || null,
        urgency || null, siteArea || null, description || null, notes || null,
      ]
    );
  })();

  const notify = sendMail(
    `[New Booking] ${fullName} — ${service}`,
    [
      rowHtml('Full Name', fullName),
      rowHtml('Company', company),
      rowHtml('Email', email),
      rowHtml('Phone', phone),
      rowHtml('Service', service),
      rowHtml('Preferred Date', preferredDate),
      rowHtml('Location', location),
      rowHtml('GPS Coordinates', gps),
      rowHtml('Urgency', urgency),
      rowHtml('Site Area', siteArea),
      rowHtml('Description', description),
      rowHtml('Additional Notes', notes),
    ].join('')
  );

  const [db, mail] = await Promise.allSettled([saveToDb, notify]);

  if (db.status === 'rejected') console.error('Booking DB error:', db.reason?.message);
  if (mail.status === 'rejected') console.error('Booking email error:', mail.reason?.message);

  if (db.status === 'fulfilled' || mail.status === 'fulfilled') {
    return res.status(200).json({
      ok: true,
      stored: db.status === 'fulfilled',
      emailed: mail.status === 'fulfilled',
    });
  }

  return res.status(500).json({ ok: false, error: 'Failed to save booking.' });
}
