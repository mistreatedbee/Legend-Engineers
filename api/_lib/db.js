import pg from 'pg';

const { Pool } = pg;

// In a serverless environment each warm invocation reuses the same module
// instance, so we cache the pool on globalThis to avoid exhausting connections.
function makePool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  const needsSsl =
    /sslmode=require/i.test(connectionString) || process.env.NODE_ENV === 'production';

  return new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 3, // keep small for serverless
  });
}

export const pool = globalThis.__leDbPool ?? (globalThis.__leDbPool = makePool());

// Create/upgrade tables once per warm instance (idempotent, safe to re-run).
export async function ensureSchema() {
  if (!pool) throw new Error('DATABASE_URL is not set');
  if (globalThis.__leSchemaReady) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS booking_requests (
      id              SERIAL PRIMARY KEY,
      full_name       TEXT NOT NULL,
      company         TEXT,
      email           TEXT NOT NULL,
      phone           TEXT NOT NULL,
      service         TEXT NOT NULL,
      preferred_date  DATE,
      location        TEXT NOT NULL,
      gps_coordinates TEXT,
      urgency         TEXT,
      site_area       TEXT,
      description     TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW()
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

  globalThis.__leSchemaReady = true;
}
