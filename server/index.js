import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import { pool } from './db.js';

const mailer = process.env.EMAIL_USER
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })
  : null;

function rowHtml(label, value) {
  return `<tr><td style="padding:6px 12px;font-weight:600;background:#f5f5f5;white-space:nowrap">${label}</td><td style="padding:6px 12px">${value || '—'}</td></tr>`;
}

async function sendMail(subject, htmlRows) {
  if (!mailer) return;
  try {
    await mailer.sendMail({
      from: `"Legend Engineers Website" <${process.env.EMAIL_USER}>`,
      to: 'enerdgegroup@gmail.com',
      cc: 'egengineers88@gmail.com',
      subject,
      html: `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">${htmlRows}</table>`,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://legendengineers.co.za',
    'X-Title': 'Legend Engineers',
  },
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// Create tables on startup (idempotent — safe to run every time)
await pool.query(`
  CREATE TABLE IF NOT EXISTS booking_requests (
    id            SERIAL PRIMARY KEY,
    full_name     TEXT NOT NULL,
    company       TEXT,
    email         TEXT NOT NULL,
    phone         TEXT NOT NULL,
    service       TEXT NOT NULL,
    preferred_date DATE,
    location      TEXT NOT NULL,
    gps_coordinates TEXT,
    urgency       TEXT,
    site_area     TEXT,
    description   TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS quote_requests (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    service_type  TEXT NOT NULL,
    scope         TEXT,
    notes         TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  );
`);

await pool.query(`
  ALTER TABLE quote_requests
    ADD COLUMN IF NOT EXISTS company TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS location TEXT,
    ADD COLUMN IF NOT EXISTS gps_coordinates TEXT;

  ALTER TABLE booking_requests
    ADD COLUMN IF NOT EXISTS notes TEXT;
`);

console.log('Database tables ready.');

// POST /api/bookings — save investigation booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      fullName, company, email, phone, service,
      preferredDate, location, gps, urgency, siteArea, description, notes,
    } = req.body;

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

    await sendMail(
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

    res.json({ ok: true });
  } catch (err) {
    console.error('Booking insert error:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to save booking.' });
  }
});

// POST /api/quotes — save quotation request
app.post('/api/quotes', async (req, res) => {
  try {
    const { name, company, email, phone, serviceType, location, gps, scope, notes } = req.body;

    await pool.query(
      `INSERT INTO quote_requests
        (name, company, email, phone, service_type, location, gps_coordinates, scope, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [name, company || null, email, phone || null, serviceType, location || null, gps || null, scope || null, notes || null]
    );

    await sendMail(
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

    res.json({ ok: true });
  } catch (err) {
    console.error('Quote insert error:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to save quote request.' });
  }
});

// POST /api/chat — AI assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-haiku',
      messages: [
        {
          role: 'system',
          content: `You are a professional assistant for Legend Engineers, an engineering firm based in Mpumalanga, South Africa, operating under the Enerdge Group. The company specialises in Geotechnical Investigations, Civil Engineering, and Mechanical Engineering. Major clients include Eskom Holdings and Seriti Resources. Be concise, professional, and helpful. For quotes or site bookings, direct users to the booking and quote forms on the website.`,
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? 'I was unable to generate a response. Please try again.';
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'AI service unavailable. Please try again shortly.' });
  }
});

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Serve built React app in production
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, '../dist/index.html'))
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
