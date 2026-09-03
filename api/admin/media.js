import { pool, ensureSchema } from '../_lib/db.js';
import { assertSameOrigin, requireAdmin } from '../_lib/auth.js';
import { deleteStoredFile } from '../_lib/storage.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  await ensureSchema();

  if (req.method === 'GET') {
    const { rows } = await pool.query(
      `SELECT * FROM media WHERE deleted_at IS NULL ORDER BY created_at DESC`
    );
    return res.status(200).json({ ok: true, media: rows });
  }

  if (req.method === 'DELETE') {
    if (!assertSameOrigin(req)) return res.status(403).json({ ok: false, error: 'Invalid origin' });

    const id = Number(req.query?.id);
    if (!id) return res.status(400).json({ ok: false, error: 'Media id is required.' });

    const { rows } = await pool.query('SELECT * FROM media WHERE id = $1 AND deleted_at IS NULL', [id]);
    const file = rows[0];
    if (!file) return res.status(404).json({ ok: false, error: 'File not found.' });

    const force = req.query?.force === 'true';
    if (!force) {
      const usage = await pool.query(
        `SELECT id, title FROM projects WHERE deleted_at IS NULL AND cover_image = $1
         UNION
         SELECT p.id, p.title FROM project_images pi JOIN projects p ON p.id = pi.project_id
         WHERE pi.image_url = $1 AND p.deleted_at IS NULL`,
        [file.url]
      );
      if (usage.rows.length) {
        return res.status(409).json({
          ok: false,
          error: 'This image is used by one or more projects.',
          usedBy: usage.rows,
        });
      }
    }

    await pool.query('UPDATE media SET deleted_at = NOW() WHERE id = $1', [id]);
    if (file.storage_path) {
      try {
        await deleteStoredFile(file.storage_path);
      } catch (err) {
        console.error('Media storage delete error:', err.message);
      }
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, DELETE');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
