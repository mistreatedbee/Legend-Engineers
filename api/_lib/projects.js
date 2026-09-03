import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { pool, ensureSchema } from './db.js';
import { slugify, uniqueSlug } from './slug.js';

const legacyPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'legacyProjects.json');
let legacyCache;

export function getLegacyProjects() {
  if (!legacyCache) {
    legacyCache = JSON.parse(readFileSync(legacyPath, 'utf8'));
  }
  return legacyCache;
}

export function mapLegacyToPublic(p, idx) {
  return {
    id: `legacy-${p.id}`,
    slug: slugify(`${p.title}-${p.id}`),
    title: p.title,
    category: p.category,
    company: p.company,
    location: p.location,
    client: p.client,
    services: p.services,
    description: p.description,
    shortDescription: p.description?.slice(0, 220) || '',
    scope: p.scope || [],
    completionDate: p.date,
    projectValue: p.value || null,
    poNumber: p.poNumber || null,
    contractNumber: p.contractNumber || null,
    gpsCoords: p.gpsCoords || null,
    siteArea: p.siteArea || null,
    coverImage: p.image,
    images: [],
    featured: idx < 3,
    status: 'published',
    displayOrder: 1000 - idx,
    source: 'legacy',
    publishedAt: null,
    createdAt: null,
    updatedAt: null,
  };
}

export function mapDbRowToPublic(row, images = []) {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    category: row.category,
    company: row.company,
    location: row.location,
    client: row.client,
    services: row.services,
    description: row.description,
    shortDescription: row.short_description || row.description?.slice(0, 220) || '',
    scope: row.scope || [],
    completionDate: row.completion_date,
    projectValue: row.project_value,
    poNumber: row.po_number,
    contractNumber: row.contract_number,
    gpsCoords: row.gps_coords,
    siteArea: row.site_area,
    coverImage: row.cover_image,
    images,
    featured: row.featured,
    status: row.status,
    displayOrder: row.display_order,
    source: 'database',
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchPublishedProjects({ slug, featuredOnly = false } = {}) {
  await ensureSchema();

  let sql = `
    SELECT p.*, COALESCE(
      json_agg(
        json_build_object(
          'id', pi.id,
          'url', pi.image_url,
          'altText', pi.alt_text,
          'displayOrder', pi.display_order
        ) ORDER BY pi.display_order, pi.id
      ) FILTER (WHERE pi.id IS NOT NULL), '[]'
    ) AS images
    FROM projects p
    LEFT JOIN project_images pi ON pi.project_id = p.id
    WHERE p.deleted_at IS NULL AND p.status = 'published'
  `;
  const params = [];

  if (slug) {
    params.push(slug);
    sql += ` AND p.slug = $${params.length}`;
  }
  if (featuredOnly) sql += ' AND p.featured = true';

  sql += ' GROUP BY p.id ORDER BY p.display_order DESC, p.published_at DESC NULLS LAST, p.id DESC';

  const { rows } = await pool.query(sql, params);
  const dbProjects = rows.map((row) => {
    const images = (row.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      displayOrder: img.displayOrder,
    }));
    return mapDbRowToPublic(row, images);
  });

  if (slug) {
    if (dbProjects[0]) return dbProjects[0];
    const legacy = getLegacyProjects()
      .map(mapLegacyToPublic)
      .find((p) => p.slug === slug);
    return legacy || null;
  }

  if (dbProjects.length) return dbProjects;

  return getLegacyProjects().map(mapLegacyToPublic);
}

export async function importLegacyProjects(adminId) {
  await ensureSchema();
  const legacy = getLegacyProjects();
  let imported = 0;

  for (const [idx, p] of legacy.entries()) {
    const slug = await uniqueSlug(pool, 'projects', `${p.title}-${p.id}`);
    const exists = await pool.query('SELECT id FROM projects WHERE slug = $1', [slug]);
    if (exists.rows.length) continue;

    await pool.query(
      `INSERT INTO projects (
        slug, title, client, location, category, company, services,
        short_description, description, scope, completion_date, project_value,
        po_number, contract_number, gps_coords, site_area, cover_image,
        featured, status, display_order, published_at, created_by, updated_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,'published',$19,NOW(),$20,$20)`,
      [
        slug,
        p.title,
        p.client,
        p.location,
        p.category,
        p.company,
        p.services,
        p.description?.slice(0, 220) || '',
        p.description,
        JSON.stringify(p.scope || []),
        p.date,
        p.value || null,
        p.poNumber || null,
        p.contractNumber || null,
        p.gpsCoords || null,
        p.siteArea || null,
        p.image,
        idx < 3,
        1000 - idx,
        adminId,
      ]
    );
    imported += 1;
  }

  return imported;
}
