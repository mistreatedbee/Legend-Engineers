import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from '../api';
import { PageHeader, Select, Spinner, StatusBadge, EmptyState, CardTable } from '../components/ui';
import { useNotify } from '../components/Notify';

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

const STATUSES = ['new', 'read', 'replied', 'archived'];

export function Queries() {
  const [params, setParams] = useSearchParams();
  const { notify } = useNotify();
  const [queries, setQueries] = useState<api.AdminQuery[] | null>(null);
  const [loading, setLoading] = useState(true);
  const type = params.get('type') || 'all';
  const status = params.get('status') || 'all';

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listQueries({ type, status });
      setQueries(data.queries);
    } catch (err: any) {
      notify(err.message || 'Could not load queries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, status]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const changeStatus = async (q: api.AdminQuery, status: string) => {
    try {
      await api.updateQuery(q.type, q.id, status);
      notify('Query status updated.');
      setQueries((qs) => qs && qs.map((x) => (x.id === q.id && x.type === q.type ? { ...x, status } : x)));
    } catch (err: any) {
      notify(err.message || 'Could not update status.', 'error');
    }
  };

  return (
    <div>
      <PageHeader title="Messages / Queries" description="Booking and quote requests submitted through the public site." />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Select value={type} onChange={(e) => setParam('type', e.target.value)} className="w-full sm:w-44">
          <option value="all">All types</option>
          <option value="booking">Site Bookings</option>
          <option value="quote">Quote Requests</option>
        </Select>
        <Select value={status} onChange={(e) => setParam('status', e.target.value)} className="w-full sm:w-44">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : !queries?.length ? (
        <EmptyState title="No queries yet" description="Contact form submissions will appear here." />
      ) : (
        <CardTable>
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {queries.map((q) => (
                <tr key={`${q.type}-${q.id}`}>
                  <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{q.name}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{q.email}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{q.phone || '—'}</td>
                  <td className="px-4 py-3 text-ink/60 max-w-xs truncate" title={q.message || undefined}>
                    <span className="uppercase text-[10px] font-semibold text-ink/40 mr-1.5">
                      {q.type === 'booking' ? 'Booking' : 'Quote'}
                    </span>
                    {q.subject}
                  </td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{formatDate(q.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={q.status} />
                      <Select
                        value={q.status}
                        onChange={(e) => changeStatus(q, e.target.value)}
                        className="!py-1 !px-2 text-xs w-28">
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Select>
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
