import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { slugify, uniqueSlug } from './slug.js';

const legacyPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'legacyJobs.json');
let legacyCache;

export function getLegacyJobs() {
  if (!legacyCache) {
    legacyCache = JSON.parse(readFileSync(legacyPath, 'utf8'));
  }
  return legacyCache;
}

// Brings the vacancies that were hardcoded on the public site (src/data/careers.ts)
// into the jobs table as normal, editable rows — mirrors importLegacyProjects()
// in projects.js. Skipped for any slug that already exists, so it's safe to
// run more than once.
export async function importLegacyJobs(pool, adminId) {
  const legacy = getLegacyJobs();
  let imported = 0;

  for (const [idx, j] of legacy.entries()) {
    const slug = await uniqueSlug(pool, 'jobs', slugify(j.id || j.title));
    const exists = await pool.query('SELECT id FROM jobs WHERE slug = $1', [slug]);
    if (exists.rows.length) continue;

    await pool.query(
      `INSERT INTO jobs (
        slug, title, department, location, employment_type, description,
        requirements, closing_date, status, display_order, published_at, created_by, updated_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12)`,
      [
        slug,
        j.title,
        j.department || null,
        j.location,
        j.type || 'Full-time',
        j.description,
        JSON.stringify(j.requirements || []),
        j.closingDate || null,
        j.status === 'Open' ? 'open' : 'closed',
        1000 - idx,
        j.status === 'Open' ? new Date() : null,
        adminId,
      ]
    );
    imported += 1;
  }

  return imported;
}
