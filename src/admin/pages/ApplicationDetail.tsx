import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Mail } from 'lucide-react';
import * as api from '../api';
import { Field, TextArea, Button, Spinner } from '../components/ui';
import { useNotify } from '../components/Notify';

const PIPELINE = ['new', 'reviewing', 'shortlisted', 'interview', 'hired'];

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return d;
  }
}

export function ApplicationDetail() {
  const { id } = useParams();
  const { notify } = useNotify();
  const [app, setApp] = useState<api.AdminApplication | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .getApplication(id!)
      .then((data) => {
        setApp(data.application);
        setNotes(data.application.internal_notes || '');
      })
      .catch((err) => notify(err.message || 'Could not load application.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const setStatus = async (status: string) => {
    setSaving(true);
    try {
      const res = await api.updateApplication(id!, { status });
      setApp(res.application);
      notify('Application status updated.');
    } catch (err: any) {
      notify(err.message || 'Could not update status.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      const res = await api.updateApplication(id!, { internalNotes: notes });
      setApp(res.application);
      notify('Internal notes saved.');
    } catch (err: any) {
      notify(err.message || 'Could not save notes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!app) return null;

  const isRejected = app.status === 'rejected';

  return (
    <div className="max-w-3xl">
      <Link to="/admin/applications" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-brand-700 mb-5">
        <ArrowLeft size={15} /> All Applications
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{app.full_name}</h1>
          <p className="text-sm text-ink/60 mt-1">
            Applied for <span className="font-medium text-ink">{app.position}</span> on {formatDate(app.created_at)}
          </p>
        </div>
        <a href={`mailto:${app.email}`}>
          <Button variant="secondary" size="sm">
            <Mail size={14} /> Email Applicant
          </Button>
        </a>
      </div>

      {/* Status pipeline */}
      <div className="bg-white border border-ink/10 rounded-xl p-5 mb-5">
        <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-3">
          Application Status
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {PIPELINE.map((s) => (
            <button
              key={s}
              type="button"
              disabled={saving}
              onClick={() => setStatus(s)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                app.status === s
                  ? 'bg-brand-700 text-white'
                  : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
              }`}>
              {s}
            </button>
          ))}
          <span className="text-ink/30 text-xs px-1">or</span>
          <button
            type="button"
            disabled={saving}
            onClick={() => setStatus('rejected')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              isRejected ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}>
            Rejected
          </button>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-5 mb-5 grid sm:grid-cols-2 gap-5 text-sm">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1">Email</span>
          <a href={`mailto:${app.email}`} className="text-brand-700 hover:underline">{app.email}</a>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1">Phone</span>
          <a href={`tel:${app.phone}`} className="text-ink">{app.phone}</a>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1">Location</span>
          <span className="text-ink">{app.location || '—'}</span>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1">Years of Experience</span>
          <span className="text-ink">{app.experience || '—'}</span>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1">LinkedIn</span>
          {app.linkedin ? (
            <a href={app.linkedin} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline break-all">
              {app.linkedin}
            </a>
          ) : (
            <span className="text-ink/40">—</span>
          )}
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1">CV</span>
          {app.cv_url ? (
            <a href={app.cv_url} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline inline-flex items-center gap-1.5">
              <Download size={14} /> Download CV
            </a>
          ) : (
            <span className="text-ink/40">Not provided</span>
          )}
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-5 mb-5">
        <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">Cover Letter</span>
        <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">{app.cover_letter}</p>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-5">
        <Field label="Internal Notes" hint="Only visible to admins — never shown publicly.">
          <TextArea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button size="sm" className="mt-3" onClick={saveNotes} disabled={saving}>
          Save Notes
        </Button>
      </div>
    </div>
  );
}
