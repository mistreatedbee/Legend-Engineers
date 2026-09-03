// Every admin route except /upload (which needs raw-body multipart parsing
// and so stays its own Vercel function) is dispatched through this map by a
// single catch-all function (api/admin/[...path].js). This keeps the Vercel
// Hobby plan's 12-serverless-function limit from being exceeded — 14
// separate admin files would otherwise count as 14 functions on their own.
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

export const adminRoutes = {
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
