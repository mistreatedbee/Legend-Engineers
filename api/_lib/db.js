import pg from 'pg';

const { Pool } = pg;

// In a serverless environment each warm invocation reuses the same module
// instance, so we cache the pool on globalThis to avoid exhausting connections.
function makePool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  const needsSsl =
    /sslmode=require/i.test(connectionString) ||
    /supabase\.com/i.test(connectionString) ||
    process.env.NODE_ENV === 'production';

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

    CREATE TABLE IF NOT EXISTS career_applications (
      id          SERIAL PRIMARY KEY,
      full_name   TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT NOT NULL,
      position    TEXT NOT NULL,
      location    TEXT,
      experience  TEXT,
      linkedin    TEXT,
      cover_letter TEXT NOT NULL,
      cv_filename TEXT,
      cv_storage_path TEXT,
      cv_url TEXT,
      job_id INT,
      status TEXT DEFAULT 'new',
      internal_notes TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      last_login_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      id SERIAL PRIMARY KEY,
      ip TEXT,
      email TEXT,
      success BOOLEAN DEFAULT false,
      attempted_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      client TEXT,
      location TEXT,
      category TEXT NOT NULL,
      company TEXT,
      services TEXT,
      short_description TEXT,
      description TEXT NOT NULL,
      scope JSONB DEFAULT '[]'::jsonb,
      completion_date TEXT,
      project_value TEXT,
      po_number TEXT,
      contract_number TEXT,
      gps_coords TEXT,
      site_area TEXT,
      cover_image TEXT NOT NULL,
      featured BOOLEAN DEFAULT false,
      status TEXT DEFAULT 'draft',
      display_order INT DEFAULT 0,
      published_at TIMESTAMPTZ,
      created_by INT REFERENCES admin_users(id),
      updated_by INT REFERENCES admin_users(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS project_images (
      id SERIAL PRIMARY KEY,
      project_id INT REFERENCES projects(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      storage_path TEXT,
      alt_text TEXT,
      display_order INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      department TEXT,
      location TEXT NOT NULL,
      employment_type TEXT NOT NULL,
      description TEXT NOT NULL,
      responsibilities TEXT,
      requirements JSONB DEFAULT '[]'::jsonb,
      qualifications TEXT,
      experience TEXT,
      closing_date DATE,
      application_email TEXT,
      status TEXT DEFAULT 'draft',
      display_order INT DEFAULT 0,
      published_at TIMESTAMPTZ,
      created_by INT REFERENCES admin_users(id),
      updated_by INT REFERENCES admin_users(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS media (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL,
      url TEXT NOT NULL,
      storage_path TEXT,
      mime_type TEXT,
      size_bytes INT,
      alt_text TEXT,
      created_by INT REFERENCES admin_users(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    ALTER TABLE career_applications
      ADD COLUMN IF NOT EXISTS cv_storage_path TEXT,
      ADD COLUMN IF NOT EXISTS cv_url TEXT,
      ADD COLUMN IF NOT EXISTS job_id INT,
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new',
      ADD COLUMN IF NOT EXISTS internal_notes TEXT;

    ALTER TABLE booking_requests
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

    ALTER TABLE quote_requests
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
  `);

  globalThis.__leSchemaReady = true;
}
