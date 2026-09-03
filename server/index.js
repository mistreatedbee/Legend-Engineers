import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { ensureSchema } from '../api/_lib/db.js';

// Public API handlers
import healthHandler from '../api/health.js';
import chatHandler from '../api/chat.js';
import bookingsHandler from '../api/bookings.js';
import quotesHandler from '../api/quotes.js';
import careerApplicationsHandler from '../api/career-applications.js';
import careersHandler from '../api/careers.js';
import projectsHandler from '../api/projects.js';

// Admin API handlers
import adminLoginHandler from '../api/admin/login.js';
import adminLogoutHandler from '../api/admin/logout.js';
import adminAccountHandler from '../api/admin/account.js';
import adminDashboardHandler from '../api/admin/dashboard.js';
import adminProjectsHandler from '../api/admin/projects.js';
import adminProjectHandler from '../api/admin/project.js';
import adminJobsHandler from '../api/admin/jobs.js';
import adminJobHandler from '../api/admin/job.js';
import adminApplicationsHandler from '../api/admin/applications.js';
import adminApplicationHandler from '../api/admin/application.js';
import adminQueriesHandler from '../api/admin/queries.js';
import adminSettingsHandler from '../api/admin/settings.js';
import adminMediaHandler from '../api/admin/media.js';
import adminUploadHandler from '../api/admin/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
// express.json() only parses requests whose Content-Type is application/json,
// so the two multipart routes (career-applications, admin/upload) pass through
// untouched for their own busboy-based parsing — matching Vercel's per-route
// `bodyParser: false` behaviour without any special-casing here.
app.use(express.json());

// Every handler below is the exact same Vercel serverless function used in
// production (api/**/*.js) — Express's (req, res) are a superset of the
// Node http primitives those handlers expect, so they run unmodified. This
// keeps local dev and production identical and avoids maintaining a second,
// divergent copy of any route.
function route(handler) {
  return (req, res) => handler(req, res);
}

// Public routes
app.all('/api/health', route(healthHandler));
app.all('/api/chat', route(chatHandler));
app.all('/api/bookings', route(bookingsHandler));
app.all('/api/quotes', route(quotesHandler));
app.all('/api/career-applications', route(careerApplicationsHandler));
app.all('/api/careers', route(careersHandler));
app.all('/api/projects', route(projectsHandler));

// Admin routes
app.all('/api/admin/login', route(adminLoginHandler));
app.all('/api/admin/logout', route(adminLogoutHandler));
app.all('/api/admin/account', route(adminAccountHandler));
app.all('/api/admin/dashboard', route(adminDashboardHandler));
app.all('/api/admin/projects', route(adminProjectsHandler));
app.all('/api/admin/project', route(adminProjectHandler));
app.all('/api/admin/jobs', route(adminJobsHandler));
app.all('/api/admin/job', route(adminJobHandler));
app.all('/api/admin/applications', route(adminApplicationsHandler));
app.all('/api/admin/application', route(adminApplicationHandler));
app.all('/api/admin/queries', route(adminQueriesHandler));
app.all('/api/admin/settings', route(adminSettingsHandler));
app.all('/api/admin/media', route(adminMediaHandler));
app.all('/api/admin/upload', route(adminUploadHandler));

// Serve built React app in production
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, '../dist/index.html'))
);

const PORT = process.env.PORT || 3001;

try {
  await ensureSchema();
  console.log('Database schema ready.');
} catch (err) {
  console.error('Database schema check failed:', err.message);
}

app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
