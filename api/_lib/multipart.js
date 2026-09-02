import Busboy from 'busboy';
import { MAX_CV_BYTES, sanitizeFilename } from './validate.js';

export function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const fields = {};
    let file = null;
    let fileTooLarge = false;

    const bb = Busboy({
      headers: req.headers,
      limits: { files: 1, fileSize: MAX_CV_BYTES },
    });

    bb.on('field', (name, val) => {
      fields[name] = val;
    });

    bb.on('file', (_name, stream, info) => {
      const chunks = [];
      let size = 0;

      stream.on('data', (chunk) => {
        size += chunk.length;
        if (size > MAX_CV_BYTES) {
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
