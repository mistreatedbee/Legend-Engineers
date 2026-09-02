const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+().-]{7,20}$/;

const ALLOWED_EXT = ['.pdf', '.doc', '.docx'];
const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export const MAX_CV_BYTES = 5 * 1024 * 1024;

export function sanitizeText(value, maxLen = 5000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function isValidEmail(email) {
  return EMAIL_RE.test(email);
}

export function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return PHONE_RE.test(phone) && digits.length >= 7;
}

export function sanitizeFilename(name) {
  const base = String(name || 'cv')
    .replace(/[/\\]/g, '')
    .replace(/[^\w.\-() ]/g, '_')
    .slice(0, 120);
  return base || 'cv.pdf';
}

export function isAllowedCv(file) {
  if (!file?.buffer?.length) return false;
  if (file.buffer.length > MAX_CV_BYTES) return false;

  const lower = file.filename.toLowerCase();
  const hasExt = ALLOWED_EXT.some((ext) => lower.endsWith(ext));
  const hasMime = ALLOWED_MIME.has(file.mimeType);
  return hasExt || hasMime;
}

export function validateCareerApplication(fields, file) {
  const errors = [];

  const fullName = sanitizeText(fields.fullName, 200);
  const email = sanitizeText(fields.email, 254);
  const phone = sanitizeText(fields.phone, 30);
  const position = sanitizeText(fields.position, 200);
  const location = sanitizeText(fields.location, 200);
  const coverLetter = sanitizeText(fields.coverLetter, 5000);
  const linkedIn = sanitizeText(fields.linkedIn, 500);
  const experience = sanitizeText(fields.experience, 50);

  if (!fullName) errors.push('Full name is required.');
  if (!email || !isValidEmail(email)) errors.push('A valid email address is required.');
  if (!phone || !isValidPhone(phone)) errors.push('A valid phone number is required.');
  if (!position) errors.push('Position is required.');
  if (!coverLetter) errors.push('Cover letter is required.');
  if (!file) errors.push('CV / resume upload is required.');
  else if (!isAllowedCv(file)) errors.push('CV must be PDF, DOC, or DOCX and under 5 MB.');

  if (fields._gotcha) {
    return { ok: false, honeypot: true, errors: [] };
  }

  return {
    ok: errors.length === 0,
    errors,
    data: { fullName, email, phone, position, location, coverLetter, linkedIn, experience },
  };
}
