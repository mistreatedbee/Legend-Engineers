import { pool, ensureSchema } from './_lib/db.js';
import { sendMail, rowHtml } from './_lib/mail.js';
import { parseMultipartForm } from './_lib/multipart.js';
import { escapeHtml, validateCareerApplication } from './_lib/validate.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { fields, file, fileTooLarge } = await parseMultipartForm(req);

    if (fileTooLarge) {
      return res.status(400).json({ ok: false, error: 'CV file exceeds the 5 MB limit.' });
    }

    const validation = validateCareerApplication(fields, file);

    if (validation.honeypot) {
      return res.status(200).json({ ok: true });
    }

    if (!validation.ok) {
      return res.status(400).json({ ok: false, error: validation.errors[0] });
    }

    const { fullName, email, phone, position, location, coverLetter, linkedIn, experience } =
      validation.data;

    const saveToDb = (async () => {
      await ensureSchema();
      await pool.query(
        `INSERT INTO career_applications
           (full_name, email, phone, position, location, experience, linkedin, cover_letter, cv_filename)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          fullName,
          email,
          phone,
          position,
          location || null,
          experience || null,
          linkedIn || null,
          coverLetter,
          file?.filename || null,
        ]
      );
    })();

    const subject = `JOB APPLICATION - ${position} - ${fullName}`;
    const htmlRows = [
      rowHtml('Applicant', escapeHtml(fullName)),
      rowHtml('Email', escapeHtml(email)),
      rowHtml('Phone', escapeHtml(phone)),
      rowHtml('Position', escapeHtml(position)),
      rowHtml('Location', escapeHtml(location)),
      rowHtml('Experience', escapeHtml(experience)),
      rowHtml('LinkedIn', linkedIn ? escapeHtml(linkedIn) : '—'),
      rowHtml('Cover Letter', escapeHtml(coverLetter).replace(/\n/g, '<br>')),
    ].join('');

    const attachments = file
      ? [{ filename: file.filename, content: file.buffer, contentType: file.mimeType }]
      : [];

    const notify = sendMail(subject, htmlRows, attachments);

    const [db, mail] = await Promise.allSettled([saveToDb, notify]);

    if (db.status === 'rejected') console.error('Career application DB error:', db.reason?.message);
    if (mail.status === 'rejected') {
      console.error('Career application email error:', mail.reason?.message);
    }

    if (db.status === 'fulfilled' || mail.status === 'fulfilled') {
      return res.status(200).json({
        ok: true,
        stored: db.status === 'fulfilled',
        emailed: mail.status === 'fulfilled',
      });
    }

    return res.status(500).json({ ok: false, error: 'Failed to submit application.' });
  } catch (err) {
    console.error('Career application error:', err.message);
    return res.status(500).json({ ok: false, error: 'Failed to submit application.' });
  }
}
