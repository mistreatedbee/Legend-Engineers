import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, FolderKanban, MessageSquare, PlusSquare, FilePlus } from 'lucide-react';
import * as api from '../api';
import { PageHeader, Button, Spinner, StatusBadge } from '../components/ui';

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white border border-ink/10 rounded-xl p-5 flex items-center gap-4">
      <div className="h-11 w-11 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center flex-shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-2xl font-semibold text-ink leading-none">{value}</div>
        <div className="text-xs uppercase tracking-wide text-ink/50 mt-1.5">{label}</div>
      </div>
    </div>
  );
}

function ListCard({
  title,
  emptyText,
  children,
}: {
  title: string;
  emptyText: string;
  children: React.ReactNode[];
}) {
  return (
    <div className="bg-white border border-ink/10 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-ink mb-3">{title}</h3>
      {children.length ? (
        <ul className="space-y-3">{children}</ul>
      ) : (
        <p className="text-sm text-ink/40 py-4 text-center">{emptyText}</p>
      )}
    </div>
  );
}

function formatDate(d: string | null) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

export function Dashboard() {
  const [data, setData] = useState<api.DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getDashboard()
      .then(setData)
      .catch((err) => setError(err.message || 'Could not load dashboard data.'));
  }, []);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!data) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="An overview of activity across the EG Legend website."
        actions={
          <>
            <Link to="/admin/projects/new">
              <Button>
                <PlusSquare size={16} /> Add Project
              </Button>
            </Link>
            <Link to="/admin/jobs/new">
              <Button variant="secondary">
                <FilePlus size={16} /> Post Job
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Jobs" value={data.stats.activeJobs} icon={Briefcase} />
        <StatCard label="New Applications" value={data.stats.newApplications} icon={Users} />
        <StatCard label="Total Projects" value={data.stats.totalProjects} icon={FolderKanban} />
        <StatCard label="New Queries" value={data.stats.newQueries} icon={MessageSquare} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <ListCard title="Recent Job Applications" emptyText="No applications yet.">
          {data.recentApplications.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Link
                  to={`/admin/applications/${a.id}`}
                  className="text-sm font-medium text-ink hover:text-brand-700 truncate block">
                  {a.full_name}
                </Link>
                <div className="text-xs text-ink/50 truncate">{a.position}</div>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ListCard>

        <ListCard title="Recent Projects" emptyText="No projects yet.">
          {data.recentProjects.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Link
                  to={`/admin/projects/${p.id}`}
                  className="text-sm font-medium text-ink hover:text-brand-700 truncate block">
                  {p.title}
                </Link>
                <div className="text-xs text-ink/50 truncate">
                  {p.category} — {p.location}
                </div>
              </div>
              <StatusBadge status={p.status} />
            </li>
          ))}
        </ListCard>

        <ListCard title="Jobs Closing Soon" emptyText="No jobs closing soon.">
          {data.closingJobs.map((j) => (
            <li key={j.id} className="flex items-center justify-between gap-3">
              <Link
                to={`/admin/jobs/${j.id}`}
                className="text-sm font-medium text-ink hover:text-brand-700 truncate">
                {j.title}
              </Link>
              <span className="text-xs text-ink/50 flex-shrink-0">{formatDate(j.closing_date)}</span>
            </li>
          ))}
        </ListCard>

        <ListCard title="Recent Contact Queries" emptyText="No queries yet.">
          {data.recentQueries.map((q) => (
            <li key={`${q.type}-${q.id}`} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-ink truncate">{q.name}</div>
                <div className="text-xs text-ink/50 truncate">{q.email}</div>
              </div>
              <StatusBadge status={q.status} />
            </li>
          ))}
        </ListCard>
      </div>
    </div>
  );
}
