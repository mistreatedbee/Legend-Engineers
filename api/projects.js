import { fetchPublishedProjects } from './_lib/projects.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { slug, featured } = req.query || {};
  try {
    if (slug) {
      const project = await fetchPublishedProjects({ slug: String(slug) });
      if (!project) return res.status(404).json({ ok: false, error: 'Project not found' });
      return res.status(200).json({ ok: true, project });
    }

    const projects = await fetchPublishedProjects({
      featuredOnly: featured === 'true',
    });
    return res.status(200).json({ ok: true, projects });
  } catch (err) {
    console.error('Projects API error:', err.message);
    return res.status(500).json({ ok: false, error: 'Failed to load projects.' });
  }
}
