import { pool, ensureSchema } from '../db.js';
import { requireAdmin } from '../auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  await ensureSchema();

  const [
    jobsOpen,
    applicationsNew,
    projectsPublished,
    queriesNew,
    recentApplications,
    recentProjects,
    closingJobs,
    recentQueries,
  ] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS c FROM jobs WHERE deleted_at IS NULL AND status = 'open'`),
    pool.query(`SELECT COUNT(*)::int AS c FROM career_applications WHERE status = 'new'`),
    pool.query(`SELECT COUNT(*)::int AS c FROM projects WHERE deleted_at IS NULL AND status = 'published'`),
    pool.query(`
      SELECT (
        (SELECT COUNT(*) FROM booking_requests WHERE COALESCE(status,'new') = 'new') +
        (SELECT COUNT(*) FROM quote_requests WHERE COALESCE(status,'new') = 'new')
      )::int AS c
    `),
    pool.query(`
      SELECT id, full_name, position, email, phone, status, created_at
      FROM career_applications ORDER BY created_at DESC LIMIT 5
    `),
    pool.query(`
      SELECT id, title, category, location, status, featured, updated_at
      FROM projects WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 5
    `),
    pool.query(`
      SELECT id, title, closing_date, status
      FROM jobs
      WHERE deleted_at IS NULL AND status = 'open' AND closing_date IS NOT NULL
      ORDER BY closing_date ASC LIMIT 5
    `),
    pool.query(`
      SELECT 'booking' AS type, id, full_name AS name, email, created_at, COALESCE(status,'new') AS status
      FROM booking_requests
      UNION ALL
      SELECT 'quote' AS type, id, name, email, created_at, COALESCE(status,'new') AS status
      FROM quote_requests
      ORDER BY created_at DESC LIMIT 6
    `),
  ]);

  return res.status(200).json({
    ok: true,
    stats: {
      activeJobs: jobsOpen.rows[0].c,
      newApplications: applicationsNew.rows[0].c,
      totalProjects: projectsPublished.rows[0].c,
      newQueries: queriesNew.rows[0].c,
    },
    recentApplications: recentApplications.rows,
    recentProjects: recentProjects.rows,
    closingJobs: closingJobs.rows,
    recentQueries: recentQueries.rows,
  });
}
