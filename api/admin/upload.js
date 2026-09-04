import { parseMultipartForm } from '../_lib/multipart.js';
import { requireAdmin } from '../_lib/auth.js';
import { pool, ensureSchema } from '../_lib/db.js';
import { uploadImageFile, storageConfigured, MAX_IMAGE_INPUT_BYTES } from '../_lib/storage.js';
import { withErrorHandling } from '../_lib/withErrorHandling.js';

export const config = { api: { bodyParser: false } };

async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!storageConfigured()) {
    return res.status(503).json({
      ok: false,
      error: 'Image storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    });
  }

  try {
    await ensureSchema();
    const { fields, file, fileTooLarge } = await parseMultipartForm(req, MAX_IMAGE_INPUT_BYTES);
    if (fileTooLarge) return res.status(400).json({ ok: false, error: 'File exceeds the 15 MB limit.' });
    if (!file) return res.status(400).json({ ok: false, error: 'No file uploaded.' });

    const folder = fields.folder || 'media';
    const uploaded = await uploadImageFile(file, String(folder));

    const { rows } = await pool.query(
      `INSERT INTO media (filename, url, storage_path, mime_type, size_bytes, alt_text, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        uploaded.filename,
        uploaded.publicUrl,
        uploaded.path,
        uploaded.mimeType,
        uploaded.size,
        fields.altText || null,
        admin.id,
      ]
    );

    return res.status(201).json({ ok: true, file: rows[0], url: uploaded.publicUrl, storagePath: uploaded.path });
  } catch (err) {
    console.error('Upload error:', err.message);
    return res.status(500).json({ ok: false, error: err.message || 'Upload failed.' });
  }
}

export default withErrorHandling(handler);
