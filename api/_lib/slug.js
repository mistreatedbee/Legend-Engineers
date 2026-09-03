export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'item';
}

export async function uniqueSlug(pool, table, base, excludeId = null) {
  let slug = slugify(base);
  let attempt = slug;
  let i = 0;
  for (;;) {
    const params = [attempt];
    let sql = `SELECT id FROM ${table} WHERE slug = $1`;
    if (excludeId) {
      sql += ' AND id <> $2';
      params.push(excludeId);
    }
    const { rows } = await pool.query(sql, params);
    if (!rows.length) return attempt;
    i += 1;
    attempt = `${slug}-${i}`;
  }
}
