import Busboy from 'busboy';
import { MAX_CV_BYTES, sanitizeFilename } from './validate.js';

// maxBytes defaults to the CV limit (5MB) for backwards compatibility —
// pass a larger one for image uploads (previously this was silently
// hardcoded to 5MB for images too, well under the documented 8MB limit).
export function parseMultipartForm(req, maxBytes = MAX_CV_BYTES) {
  return new Promise((resolve, reject) => {
    const fields = {};
    let file = null;
    let fileTooLarge = false;

    const bb = Busboy({
      headers: req.headers,
      limits: { files: 1, fileSize: maxBytes },
    });

    bb.on('field', (name, val) => {
      fields[name] = val;
    });

    bb.on('file', (_name, stream, info) => {
      const chunks = [];
      let size = 0;

      stream.on('data', (chunk) => {
        size += chunk.length;
        if (size > maxBytes) {
          fileTooLarge = true;
          stream.resume();
          return;
        }
        chunks.push(chunk);
      });

      stream.on('end', () => {
        if (!fileTooLarge && chunks.length) {
          file = {
            filename: sanitizeFilename(info.filename),
            mimeType: info.mimeType,
            buffer: Buffer.concat(chunks),
          };
        }
      });
    });

    bb.on('error', reject);
    bb.on('finish', () => resolve({ fields, file, fileTooLarge }));
    req.pipe(bb);
  });
}
