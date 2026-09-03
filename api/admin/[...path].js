import { adminRoutes } from '../_lib/adminRoutes.js';

// Single catch-all Vercel function for every /api/admin/<name> route (except
// /upload, which is its own function — see api/admin/upload.js). Vercel puts
// the matched segments in req.query.path; the first segment picks the
// handler, and each handler still reads any further query params (e.g.
// ?id=5) off the same req.query object exactly as it did as its own route.
export default async function handler(req, res) {
  const segments = req.query?.path;
  const name = Array.isArray(segments) ? segments[0] : segments;
  const route = name && adminRoutes[name];

  if (!route) {
    return res.status(404).json({ ok: false, error: 'Not found' });
  }

  return route(req, res);
}
