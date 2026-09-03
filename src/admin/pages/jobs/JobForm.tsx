import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye } from 'lucide-react';
import * as api from '../../api';
import { Field, Input, TextArea, Select, Button, Spinner } from '../../components/ui';
import { useNotify } from '../../components/Notify';

type FormState = {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  responsibilities: string;
  requirements: string;
  qualifications: string;
  experience: string;
  closingDate: string;
  applicationEmail: string;
  status: 'draft' | 'open' | 'closed' | 'archived';
};

const EMPTY: FormState = {
  title: '',
  department: '',
  location: '',
  employmentType: 'Full-time',
  description: '',
  responsibilities: '',
  requirements: '',
  qualifications: '',
  experience: '',
  closingDate: '',
  applicationEmail: '',
  status: 'draft',
};

export function JobForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { notify } = useNotify();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api
      .getJob(id!)
      .then((data) => {
        const j: api.AdminJob = data.job;
        setForm({
          title: j.title || '',
          department: j.department || '',
          location: j.location || '',
          employmentType: j.employment_type || 'Full-time',
          description: j.description || '',
          responsibilities: j.responsibilities || '',
          requirements: (j.requirements || []).join('\n'),
          qualifications: j.qualifications || '',
          experience: j.experience || '',
          closingDate: j.closing_date ? j.closing_date.slice(0, 10) : '',
          applicationEmail: j.application_email || '',
          status: j.status,
        });
        setSlug(j.slug);
      })
      .catch((err) => notify(err.message || 'Could not load job.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    if (!form.title.trim()) return 'Job title is required.';
    if (!form.location.trim()) return 'Location is required.';
    if (!form.employmentType.trim()) return 'Employment type is required.';
    if (!form.description.trim()) return 'Job description is required.';
    if (!form.closingDate) return 'Closing date is required.';
    return null;
  };

  const save = async (status: FormState['status']) => {
    const err = validate();
    if (err) {
      notify(err, 'error');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      department: form.department || null,
      location: form.location,
      employmentType: form.employmentType,
      description: form.description,
      responsibilities: form.responsibilities || null,
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      qualifications: form.qualifications || null,
      experience: form.experience || null,
      closingDate: form.closingDate,
      applicationEmail: form.applicationEmail || null,
      status,
    };
    try {
      if (isNew) {
        const res = await api.createJob(payload);
        setSlug(res.job.slug);
        notify(status === 'open' ? 'Job posted successfully.' : 'Job saved as draft.');
        navigate(`/admin/jobs/${res.job.id}`, { replace: true });
      } else {
        const res = await api.updateJob(id!, payload);
        setSlug(res.job.slug);
        notify('Job updated successfully.');
      }
    } catch (err: any) {
      notify(err.message || 'Job could not be saved. Please try again.', 'error');
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

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-ink">{isNew ? 'Post New Job' : 'Edit Job'}</h1>
        {slug && form.status === 'open' && (
          <a href="/#careers" target="_blank" rel="noreferrer">
            <Button variant="secondary" size="sm">
              <Eye size={14} /> View on site
            </Button>
          </a>
        )}
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Job Title" required>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Site Engineer" />
          </Field>
          <Field label="Department">
            <Input value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="Civil Engineering" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Location" required>
            <Input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Witbank, Mpumalanga" />
          </Field>
          <Field label="Employment Type" required>
            <Select value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Temporary</option>
            </Select>
          </Field>
        </div>

        <Field label="Job Description" required>
          <TextArea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>

        <Field label="Responsibilities">
          <TextArea rows={3} value={form.responsibilities} onChange={(e) => set('responsibilities', e.target.value)} />
        </Field>

        <Field label="Requirements" hint="One item per line — shown as a bullet list.">
          <TextArea rows={3} value={form.requirements} onChange={(e) => set('requirements', e.target.value)} placeholder={'Valid driver\'s license\n3+ years experience'} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Qualifications">
            <Input value={form.qualifications} onChange={(e) => set('qualifications', e.target.value)} placeholder="BEng Civil Engineering" />
          </Field>
          <Field label="Experience">
            <Input value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="3-5 years" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Closing Date" required>
            <Input type="date" value={form.closingDate} onChange={(e) => set('closingDate', e.target.value)} />
          </Field>
          <Field label="Application Email" hint="Where new applications are also sent — defaults to the company email.">
            <Input type="email" value={form.applicationEmail} onChange={(e) => set('applicationEmail', e.target.value)} placeholder="careers@enerdgegroup.co.za" />
          </Field>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <Button onClick={() => save('open')} disabled={saving}>
          {saving ? 'Saving…' : 'Publish'}
        </Button>
        <Button variant="secondary" onClick={() => save('draft')} disabled={saving}>
          Save Draft
        </Button>
        <Button variant="ghost" onClick={() => navigate('/admin/jobs')} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
