import { adminRoutes } from '../_lib/adminRoutes.js';

// Single dispatcher function for every /api/admin/<name> route (except
// /upload, which stays its own function — see api/admin/upload.js). Kept as
// one function so the Vercel Hobby plan's 12-function-per-deployment limit
// isn't exceeded (14 separate admin files would otherwise count as 14).
//
// vercel.json rewrites "/api/admin/:action" here as "?action=<name>" — a
// plain named-segment rewrite, which is reliable for any framework. (A
// bracket-named catch-all file, e.g. "[...path].js", is a Next.js
// convention and isn't dependable for a non-Next "Other Framework" Vercel
// project like this one — that's what broke the first attempt at this.)
export default async function handler(req, res) {
  const name = req.query?.action;
  const route = name && adminRoutes[name];

  if (!route) {
    return res.status(404).json({ ok: false, error: 'Not found' });
  }

  return route(req, res);
}
