import { randomBytes } from 'crypto';
import { sanitizeFilename } from './validate.js';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'media';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

export function storageConfigured() {
  return Boolean(getSupabaseConfig());
}

export async function uploadBuffer({ buffer, filename, mimeType, folder = 'uploads' }) {
  const cfg = getSupabaseConfig();
  if (!cfg) throw new Error('File storage is not configured');

  const safeName = sanitizeFilename(filename);
  const unique = `${Date.now()}-${randomBytes(4).toString('hex')}-${safeName}`;
  const path = `${folder}/${unique}`;

  const res = await fetch(`${cfg.url}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.key}`,
      apikey: cfg.key,
      'Content-Type': mimeType || 'application/octet-stream',
      'x-upsert': 'false',
    },
    body: buffer,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${text.slice(0, 200)}`);
  }

  const publicUrl = `${cfg.url}/storage/v1/object/public/${BUCKET}/${path}`;
  return { path, publicUrl, filename: safeName, mimeType, size: buffer.length };
}

export async function uploadImageFile(file, folder = 'projects') {
  if (!file?.buffer?.length) throw new Error('No file provided');
  if (file.buffer.length > MAX_IMAGE_BYTES) throw new Error('Image exceeds 8 MB limit');
  if (!ALLOWED_IMAGE_TYPES.has(file.mimeType) && !/\.(jpe?g|png|webp)$/i.test(file.filename)) {
    throw new Error('Only JPG, PNG, and WEBP images are allowed');
  }
  return uploadBuffer({
    buffer: file.buffer,
    filename: file.filename,
    mimeType: file.mimeType,
    folder,
  });
}

export async function uploadCvFile(file) {
  return uploadBuffer({
    buffer: file.buffer,
    filename: file.filename,
    mimeType: file.mimeType,
    folder: 'cvs',
  });
}

export async function deleteStoredFile(path) {
  const cfg = getSupabaseConfig();
  if (!cfg || !path) return;
  await fetch(`${cfg.url}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${cfg.key}`,
      apikey: cfg.key,
    },
  });
}
