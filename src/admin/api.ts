export async function adminFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(`/api/admin${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed') as Error & { status?: number; body?: any };
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export async function publicFetch(path: string) {
  const res = await fetch(path);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function uploadFile(file: File, folder = 'media') {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  return adminFetch('/upload', { method: 'POST', body: fd });
}

// ---- Types -----------------------------------------------------------

export type AdminUser = { id: number; email: string; name: string };

export type ProjectImage = {
  id?: number;
  url: string;
  storagePath?: string | null;
  altText?: string | null;
  displayOrder?: number;
};

export type AdminProject = {
  id: number;
  slug: string;
  title: string;
  client: string | null;
  location: string | null;
  category: string;
  company: string | null;
  services: string | null;
  short_description: string | null;
  description: string;
  scope: string[];
  completion_date: string | null;
  project_value: string | null;
  po_number: string | null;
  contract_number: string | null;
  gps_coords: string | null;
  site_area: string | null;
  cover_image: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  display_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  images: ProjectImage[];
};

export type AdminJob = {
  id: number;
  slug: string;
  title: string;
  department: string | null;
  location: string;
  employment_type: string;
  description: string;
  responsibilities: string | null;
  requirements: string[];
  qualifications: string | null;
  experience: string | null;
  closing_date: string | null;
  application_email: string | null;
  status: 'draft' | 'open' | 'closed' | 'archived';
  display_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminApplication = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  location: string | null;
  experience: string | null;
  linkedin: string | null;
  cover_letter: string;
  cv_filename: string | null;
  cv_url: string | null;
  status: string;
  internal_notes: string | null;
  created_at: string;
};

export type AdminQuery = {
  id: number;
  type: 'booking' | 'quote';
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export type MediaItem = {
  id: number;
  filename: string;
  url: string;
  storage_path: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  created_at: string;
};

export type SiteSettings = {
  companyName: string;
  contactEmail: string;
  queriesEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  linkedIn: string;
  facebook: string;
  [key: string]: string;
};

export type DashboardStats = {
  stats: {
    activeJobs: number;
    newApplications: number;
    totalProjects: number;
    newQueries: number;
  };
  recentApplications: any[];
  recentProjects: any[];
  closingJobs: any[];
  recentQueries: any[];
};

// ---- Auth --------------------------------------------------------------

export const login = (email: string, password: string) =>
  adminFetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const getSession = () => adminFetch('/login', { method: 'GET' });

export const logout = () => adminFetch('/logout', { method: 'POST' });

export const getAccount = () => adminFetch('/account', { method: 'GET' });

export const updateAccount = (body: { currentPassword?: string; newPassword?: string; name?: string }) =>
  adminFetch('/account', { method: 'PUT', body: JSON.stringify(body) });

// ---- Dashboard -----------------------------------------------------------

export const getDashboard = (): Promise<DashboardStats & { ok: true }> => adminFetch('/dashboard');

// ---- Projects --------------------------------------------------------------

export const listProjects = (params: Record<string, string> = {}) =>
  adminFetch(`/projects${qs(params)}`);

export const createProject = (body: Record<string, any>) =>
  adminFetch('/projects', { method: 'POST', body: JSON.stringify(body) });

export const importLegacyProjects = () =>
  adminFetch('/projects', { method: 'POST', body: JSON.stringify({ action: 'import-legacy' }) });

export const getProject = (id: number | string) => adminFetch(`/project?id=${id}`);

export const updateProject = (id: number | string, body: Record<string, any>) =>
  adminFetch(`/project?id=${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteProject = (id: number | string, hard = false) =>
  adminFetch(`/project?id=${id}${hard ? '&hard=true' : ''}`, { method: 'DELETE' });

// ---- Jobs --------------------------------------------------------------

export const listJobs = (params: Record<string, string> = {}) => adminFetch(`/jobs${qs(params)}`);

export const createJob = (body: Record<string, any>) =>
  adminFetch('/jobs', { method: 'POST', body: JSON.stringify(body) });

export const importLegacyJobs = () =>
  adminFetch('/jobs', { method: 'POST', body: JSON.stringify({ action: 'import-legacy' }) });

export const getJob = (id: number | string) => adminFetch(`/job?id=${id}`);

export const updateJob = (id: number | string, body: Record<string, any>) =>
  adminFetch(`/job?id=${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteJob = (id: number | string, hard = false) =>
  adminFetch(`/job?id=${id}${hard ? '&hard=true' : ''}`, { method: 'DELETE' });

// ---- Applications --------------------------------------------------------------

export const listApplications = (params: Record<string, string> = {}) =>
  adminFetch(`/applications${qs(params)}`);

export const getApplication = (id: number | string) => adminFetch(`/application?id=${id}`);

export const updateApplication = (
  id: number | string,
  body: { status?: string; internalNotes?: string }
) => adminFetch(`/application?id=${id}`, { method: 'PUT', body: JSON.stringify(body) });

// ---- Queries --------------------------------------------------------------

export const listQueries = (params: Record<string, string> = {}) => adminFetch(`/queries${qs(params)}`);

export const updateQuery = (type: 'booking' | 'quote', id: number, status: string) =>
  adminFetch('/queries', { method: 'PUT', body: JSON.stringify({ type, id, status }) });

// ---- Media --------------------------------------------------------------

export const listMedia = () => adminFetch('/media');

export const deleteMedia = (id: number | string, force = false) =>
  adminFetch(`/media?id=${id}${force ? '&force=true' : ''}`, { method: 'DELETE' });

// ---- Settings --------------------------------------------------------------

export const getSettings = (): Promise<{ ok: true; settings: SiteSettings }> => adminFetch('/settings');

export const updateSettings = (body: Partial<SiteSettings>) =>
  adminFetch('/settings', { method: 'PUT', body: JSON.stringify(body) });

// ---- helpers --------------------------------------------------------------

function qs(params: Record<string, string>) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null);
  if (!entries.length) return '';
  return `?${new URLSearchParams(entries as [string, string][]).toString()}`;
}
