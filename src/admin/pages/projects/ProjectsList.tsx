import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  PlusSquare,
  Search,
  Pencil,
  Eye,
  Copy,
  Archive,
  Trash2,
  UploadCloud,
  Star,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import * as api from '../../api';
import { PageHeader, Button, Input, Select, Spinner, StatusBadge, EmptyState } from '../../components/ui';
import { useNotify } from '../../components/Notify';

export function ProjectsList() {
  const [params, setParams] = useSearchParams();
  const { notify, confirm } = useNotify();

  const [projects, setProjects] = useState<api.AdminProject[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(params.get('q') || '');
  const status = params.get('status') || 'all';
  const featuredOnly = params.get('featured') === 'true';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'updated';

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listProjects({
        status,
        featured: featuredOnly ? 'true' : '',
        category,
        sort,
        q,
      });
      setProjects(data.projects);
    } catch (err: any) {
      notify(err.message || 'Could not load projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, featuredOnly, category, sort]);

  useEffect(() => {
    const t = setTimeout(() => load(), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const categories = useMemo(
    () => Array.from(new Set((projects || []).map((p) => p.category))).sort(),
    [projects]
  );

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const togglePublish = async (p: api.AdminProject) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    try {
      await api.updateProject(p.id, { status: newStatus });
      notify(newStatus === 'published' ? 'Project published successfully.' : 'Project unpublished.');
      load();
    } catch (err: any) {
      notify(err.message || 'Project could not be saved. Please try again.', 'error');
    }
  };

  const duplicate = async (p: api.AdminProject) => {
    try {
      await api.createProject({
        title: `${p.title} (Copy)`,
        client: p.client,
        location: p.location,
        category: p.category,
        company: p.company,
        services: p.services,
        shortDescription: p.short_description,
        description: p.description,
        scope: p.scope,
        completionDate: p.completion_date,
        projectValue: p.project_value,
        poNumber: p.po_number,
        contractNumber: p.contract_number,
        gpsCoords: p.gps_coords,
        siteArea: p.site_area,
        coverImage: p.cover_image,
        featured: false,
        status: 'draft',
        images: p.images,
      });
      notify('Project duplicated as a new draft.');
      load();
    } catch (err: any) {
      notify(err.message || 'Could not duplicate project.', 'error');
    }
  };

  const archive = async (p: api.AdminProject) => {
    const ok = await confirm({
      title: 'Archive this project?',
      description: `"${p.title}" will be removed from the public site and moved to Archived.`,
      confirmLabel: 'Archive',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.deleteProject(p.id);
      notify('Project archived.');
      load();
    } catch (err: any) {
      notify(err.message || 'Could not archive project.', 'error');
    }
  };

  const remove = async (p: api.AdminProject) => {
    const ok = await confirm({
      title: 'Permanently delete this project?',
      description: `This cannot be undone. "${p.title}" and its images will be removed completely. Consider Archive instead.`,
      confirmLabel: 'Delete permanently',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.deleteProject(p.id, true);
      notify('Project deleted.');
      load();
    } catch (err: any) {
      notify(err.message || 'Could not delete project.', 'error');
    }
  };

  const importLegacy = async () => {
    try {
      const res = await api.importLegacyProjects();
      notify(`Imported ${res.imported} existing project${res.imported === 1 ? '' : 's'}.`);
      load();
    } catch (err: any) {
      notify(err.message || 'Could not import existing projects.', 'error');
    }
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage the completed projects shown on the public website."
        actions={
          <Link to="/admin/projects/new">
            <Button>
              <PlusSquare size={16} /> Add Project
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
          />
        </div>
        <Select value={status} onChange={(e) => setParam('status', e.target.value)} className="w-full lg:w-40">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </Select>
        <Select
          value={category}
          onChange={(e) => setParam('category', e.target.value)}
          className="w-full lg:w-44">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <label className="flex items-center gap-2 text-sm text-ink/70 px-1 whitespace-nowrap">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => setParam('featured', e.target.checked ? 'true' : '')}
            className="rounded border-ink/30 text-brand-700 focus:ring-brand-700/40"
          />
          Featured only
        </label>
        <Select value={sort} onChange={(e) => setParam('sort', e.target.value)} className="w-full lg:w-44">
          <option value="updated">Recently updated</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A – Z</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : !projects?.length ? (
        <EmptyState
          title="No projects yet"
          description="Add your first project, or bring in the projects already on the website so they become editable here."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/admin/projects/new">
                <Button>
                  <PlusSquare size={16} /> Add Project
                </Button>
              </Link>
              <Button variant="secondary" onClick={importLegacy}>
                <UploadCloud size={16} /> Import existing projects
              </Button>
            </div>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="bg-white border border-ink/10 rounded-xl overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] bg-ink/5">
                {p.cover_image && (
                  <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <StatusBadge status={p.status} />
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Star size={11} fill="currentColor" /> Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="text-xs text-ink/50 mb-1">{p.category}</div>
                <h3 className="font-medium text-ink leading-snug mb-1">{p.title}</h3>
                <p className="text-xs text-ink/50 mb-4">
                  {p.location || '—'} · {p.completion_date || '—'}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2 border-t border-ink/10">
                  <Link to={`/admin/projects/${p.id}`}>
                    <Button variant="ghost" size="sm">
                      <Pencil size={14} /> Edit
                    </Button>
                  </Link>
                  {p.status === 'published' && (
                    <a href={`/projects/${p.slug}`} target="_blank" rel="noreferrer">
                      <Button variant="ghost" size="sm">
                        <Eye size={14} /> Preview
                      </Button>
                    </a>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => togglePublish(p)}>
                    {p.status === 'published' ? (
                      <>
                        <ArrowDownCircle size={14} /> Unpublish
                      </>
                    ) : (
                      <>
                        <ArrowUpCircle size={14} /> Publish
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => duplicate(p)}>
                    <Copy size={14} /> Duplicate
                  </Button>
                  {p.status !== 'archived' && (
                    <Button variant="ghost" size="sm" onClick={() => archive(p)}>
                      <Archive size={14} /> Archive
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => remove(p)} className="text-red-600 hover:bg-red-50">
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
