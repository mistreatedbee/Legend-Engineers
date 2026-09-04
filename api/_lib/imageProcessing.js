// Normalizes every uploaded image — JPG, PNG, WEBP, or an iPhone HEIC/HEIF
// photo — into a single web-safe, compressed format before it ever reaches
// storage. This matters for two reasons:
//  1. HEIC isn't renderable by most browsers (only Apple's own — Chrome,
//     Firefox and Edge on Windows/Android just show a broken image), so
//     storing it as-is would silently break the public site for most
//     visitors even though the upload itself "succeeded".
//  2. Phone photos are often several MB unoptimized; resizing/recompressing
//     keeps the public site fast (the spec explicitly calls for this).
const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 82;

function isHeic(filename, mimeType) {
  return /\.hei[cf]$/i.test(filename || '') || /^image\/hei[cf]/i.test(mimeType || '');
}

export async function processImage({ buffer, filename, mimeType }) {
  let working = buffer;

  if (isHeic(filename, mimeType)) {
    const heicConvert = (await import('heic-convert')).default;
    working = await heicConvert({ buffer, format: 'JPEG', quality: 0.9 });
  }

  const sharp = (await import('sharp')).default;
  const output = await sharp(working)
    .rotate() // apply EXIF orientation, then strip it — avoids sideways photos
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const base = (filename || 'image').replace(/\.[^./\\]+$/, '');
  return {
    buffer: output,
    filename: `${base}.webp`,
    mimeType: 'image/webp',
  };
}
