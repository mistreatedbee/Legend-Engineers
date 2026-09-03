import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PlusSquare, Search, Pencil, Trash2, PauseCircle, PlayCircle, Archive, UploadCloud } from 'lucide-react';
import * as api from '../../api';
import { PageHeader, Button, Input, Select, Spinner, StatusBadge, EmptyState, CardTable } from '../../components/ui';
import { useNotify } from '../../components/Notify';

function formatDate(d: string | null) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

export function JobsList() {
  const [params, setParams] = useSearchParams();
  const { notify, confirm } = useNotify();
  const [jobs, setJobs] = useState<api.AdminJob[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(params.get('q') || '');
  const status = params.get('status') || 'all';

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listJobs({ status, q });
      setJobs(data.jobs);
    } catch (err: any) {
      notify(err.message || 'Could not load jobs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const setStatus = (v: string) => {
    const next = new URLSearchParams(params);
    if (v && v !== 'all') next.set('status', v);
    else next.delete('status');
    setParams(next);
  };

  const setJobStatus = async (job: api.AdminJob, status: api.AdminJob['status']) => {
    try {
      await api.updateJob(job.id, { status });
      notify(`Job ${status === 'open' ? 'reopened' : status === 'closed' ? 'closed' : 'updated'} successfully.`);
      load();
    } catch (err: any) {
      notify(err.message || 'Job could not be saved. Please try again.', 'error');
    }
  };

  const archive = async (job: api.AdminJob) => {
    const ok = await confirm({
      title: 'Archive this job?',
      description: `"${job.title}" will be removed from the public site.`,
      confirmLabel: 'Archive',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.deleteJob(job.id);
      notify('Job archived.');
      load();
    } catch (err: any) {
      notify(err.message || 'Could not archive job.', 'error');
    }
  };

  const remove = async (job: api.AdminJob) => {
    const ok = await confirm({
      title: 'Permanently delete this job?',
      description: `This cannot be undone. "${job.title}" will be removed completely. Consider Archive instead.`,
      confirmLabel: 'Delete permanently',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.deleteJob(job.id, true);
      notify('Job deleted.');
      load();
    } catch (err: any) {
      notify(err.message || 'Could not delete job.', 'error');
    }
  };

  const importLegacy = async () => {
    try {
      const res = await api.importLegacyJobs();
      notify(`Imported ${res.imported} existing job${res.imported === 1 ? '' : 's'} from the website.`);
      load();
    } catch (err: any) {
      notify(err.message || 'Could not import existing jobs.', 'error');
    }
  };

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Manage vacancies shown on the public Careers section."
        actions={
          <Link to="/admin/jobs/new">
            <Button>
              <PlusSquare size={16} /> Post New Job
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs…" className="pl-9" />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full sm:w-44">
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
          <option value="archived">Archived</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : !jobs?.length ? (
        <EmptyState
          title="No jobs yet"
          description="Add a new vacancy, or bring in the vacancies already listed on the website so they become editable here."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/admin/jobs/new">
                <Button>
                  <PlusSquare size={16} /> Post New Job
                </Button>
              </Link>
              <Button variant="secondary" onClick={importLegacy}>
                <UploadCloud size={16} /> Import existing jobs
              </Button>
            </div>
          }
        />
      ) : (
        <CardTable>
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Closing Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{j.title}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{j.location}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{formatDate(j.closing_date)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end flex-wrap gap-1">
                      <Link to={`/admin/jobs/${j.id}`}>
                        <Button variant="ghost" size="sm">
                          <Pencil size={13} /> Edit
                        </Button>
                      </Link>
                      {j.status === 'open' ? (
                        <Button variant="ghost" size="sm" onClick={() => setJobStatus(j, 'closed')}>
                          <PauseCircle size={13} /> Close
                        </Button>
                      ) : j.status !== 'archived' ? (
                        <Button variant="ghost" size="sm" onClick={() => setJobStatus(j, 'open')}>
                          <PlayCircle size={13} /> {j.status === 'closed' ? 'Reopen' : 'Publish'}
                        </Button>
                      ) : null}
                      {j.status !== 'archived' && (
                        <Button variant="ghost" size="sm" onClick={() => archive(j)}>
                          <Archive size={13} /> Archive
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => remove(j)} className="text-red-600 hover:bg-red-50">
                        <Trash2 size={13} /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardTable>
      )}
    </div>
  );
}
