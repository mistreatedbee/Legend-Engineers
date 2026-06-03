import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { pool } from './db.js';

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

console.log('Database tables ready.');

// POST /api/bookings — save investigation booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      fullName, company, email, phone, service,
      preferredDate, location, gps, urgency, siteArea, description,
    } = req.body;

    await pool.query(
      `INSERT INTO booking_requests
        (full_name, company, email, phone, service, preferred_date,
         location, gps_coordinates, urgency, site_area, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        fullName, company || null, email, phone, service,
        preferredDate || null, location, gps || null,
        urgency || null, siteArea || null, description || null,
      ]
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
    const { name, email, serviceType, scope, notes } = req.body;

    await pool.query(
      `INSERT INTO quote_requests (name, email, service_type, scope, notes)
       VALUES ($1,$2,$3,$4,$5)`,
      [name, email, serviceType, scope || null, notes || null]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error('Quote insert error:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to save quote request.' });
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
