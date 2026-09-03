import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Download, Eye } from 'lucide-react';
import * as api from '../api';
import { PageHeader, Input, Select, Spinner, StatusBadge, EmptyState, CardTable } from '../components/ui';
import { useNotify } from '../components/Notify';

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

export function Applications() {
  const [params, setParams] = useSearchParams();
  const { notify } = useNotify();
  const [apps, setApps] = useState<api.AdminApplication[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(params.get('q') || '');
  const status = params.get('status') || 'all';

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listApplications({ status, q });
      setApps(data.applications);
    } catch (err: any) {
      notify(err.message || 'Could not load applications.', 'error');
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

  return (
    <div>
      <PageHeader title="Applications" description="Job applications submitted through the public Careers section." />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search applicants…" className="pl-9" />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full sm:w-44">
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : !apps?.length ? (
        <EmptyState title="No applications yet" description="Applications submitted from the Careers section will appear here." />
      ) : (
        <CardTable>
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">CV</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {apps.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{a.full_name}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{a.position}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{a.email}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{a.phone}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{formatDate(a.created_at)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3">
                    {a.cv_url ? (
                      <a href={a.cv_url} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline inline-flex items-center gap-1">
                        <Download size={13} /> CV
                      </a>
                    ) : (
                      <span className="text-ink/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/applications/${a.id}`} className="text-brand-700 hover:underline inline-flex items-center gap-1 text-xs font-medium">
                      <Eye size={13} /> View
                    </Link>
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
