// Every admin route except /upload (which needs raw-body multipart parsing
// and so stays its own Vercel function) is dispatched through this map by a
// single function (api/admin/router.js). This keeps the Vercel Hobby plan's
// 12-serverless-function limit from being exceeded — 13 separate admin
// files would otherwise count as 13 functions on their own.
import { withErrorHandling } from './withErrorHandling.js';
import login from './adminHandlers/login.js';
import logout from './adminHandlers/logout.js';
import account from './adminHandlers/account.js';
import dashboard from './adminHandlers/dashboard.js';
import projects from './adminHandlers/projects.js';
import project from './adminHandlers/project.js';
import jobs from './adminHandlers/jobs.js';
import job from './adminHandlers/job.js';
import applications from './adminHandlers/applications.js';
import application from './adminHandlers/application.js';
import queries from './adminHandlers/queries.js';
import settings from './adminHandlers/settings.js';
import media from './adminHandlers/media.js';

const rawRoutes = {
  login,
  logout,
  account,
  dashboard,
  projects,
  project,
  jobs,
  job,
  applications,
  application,
  queries,
  settings,
  media,
};

// Every handler here is wrapped once, centrally, so an unhandled error in
// any admin route (e.g. a missing env var, a DB hiccup) returns a clean
// JSON 500 instead of crashing the function — see withErrorHandling.js.
export const adminRoutes = Object.fromEntries(
  Object.entries(rawRoutes).map(([name, handler]) => [name, withErrorHandling(handler)])
);
