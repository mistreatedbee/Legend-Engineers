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

// Admin API handlers — same route map the api/admin/[...path].js catch-all
// function uses on Vercel (kept as one function there to stay under the
// Hobby plan's 12-function limit); upload.js stays its own route since it
// needs raw-body multipart parsing.
import { adminRoutes } from '../api/_lib/adminRoutes.js';
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
for (const [name, handler] of Object.entries(adminRoutes)) {
  app.all(`/api/admin/${name}`, route(handler));
}
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
