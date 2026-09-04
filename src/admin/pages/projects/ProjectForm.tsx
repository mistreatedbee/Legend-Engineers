import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadCloud, X, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import * as api from '../../api';
import { Field, Input, TextArea, Button, Spinner } from '../../components/ui';
import { useNotify } from '../../components/Notify';

const KNOWN_CATEGORIES = [
  'Geotechnical',
  'Civil',
  'Mechanical',
  'Electrical',
  'Building',
  'Water',
  'Energy',
  'Industrial',
  'Mining',
  'Infrastructure',
];

type ImageDraft = { url: string; storagePath?: string | null; altText?: string | null };

type FormState = {
  title: string;
  client: string;
  location: string;
  category: string;
  completionDate: string;
  shortDescription: string;
  description: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  scope: string;
};

const EMPTY: FormState = {
  title: '',
  client: '',
  location: '',
  category: '',
  completionDate: '',
  shortDescription: '',
  description: '',
  featured: false,
  status: 'draft',
  scope: '',
};

export function ProjectForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { notify } = useNotify();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [cover, setCover] = useState<ImageDraft | null>(null);
  const [gallery, setGallery] = useState<ImageDraft[]>([]);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    api
      .getProject(id!)
      .then((data) => {
        const p: api.AdminProject = data.project;
        setForm({
          title: p.title || '',
          client: p.client || '',
          location: p.location || '',
          category: p.category || '',
          completionDate: p.completion_date || '',
          shortDescription: p.short_description || '',
          description: p.description || '',
          featured: p.featured,
          status: p.status,
          scope: (p.scope || []).join('\n'),
        });
        setCover(p.cover_image ? { url: p.cover_image } : null);
        setGallery(p.images.map((img) => ({ url: img.url, altText: img.altText })));
        setSlug(p.slug);
      })
      .catch((err) => notify(err.message || 'Could not load project.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onCoverPick = async (file?: File) => {
    if (!file) return;
    setCoverUploading(true);
    try {
      const res = await api.uploadFile(file, 'projects');
      setCover({ url: res.url, storagePath: res.storagePath });
    } catch (err: any) {
      notify(err.message || 'Cover image upload failed.', 'error');
    } finally {
      setCoverUploading(false);
    }
  };

  const onGalleryPick = async (files: FileList | null) => {
    if (!files?.length) return;
    setGalleryUploading(true);
    try {
      const uploaded: ImageDraft[] = [];
      for (const file of Array.from(files)) {
        const res = await api.uploadFile(file, 'projects');
        uploaded.push({ url: res.url, storagePath: res.storagePath });
      }
      setGallery((g) => [...g, ...uploaded]);
    } catch (err: any) {
      notify(err.message || 'Some images failed to upload.', 'error');
    } finally {
      setGalleryUploading(false);
    }
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    setGallery((g) => {
      const next = [...g];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return g;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const removeImage = (idx: number) => setGallery((g) => g.filter((_, i) => i !== idx));

  const buildPayload = (status: FormState['status']) => ({
    title: form.title,
    client: form.client || null,
    location: form.location || null,
    category: form.category,
    completionDate: form.completionDate || null,
    shortDescription: form.shortDescription || null,
    description: form.description,
    scope: form.scope.split('\n').map((s) => s.trim()).filter(Boolean),
    coverImage: cover?.url,
    images: gallery,
    featured: form.featured,
    status,
  });

  const validate = () => {
    if (!form.title.trim()) return 'Project title is required.';
    if (!form.location.trim()) return 'Location is required.';
    if (!form.category.trim()) return 'Category is required.';
    if (!form.description.trim()) return 'Full description is required.';
    if (!cover?.url) return 'A cover image is required.';
    return null;
  };

  const save = async (status: FormState['status']) => {
    const err = validate();
    if (err) {
      notify(err, 'error');
      return;
    }
    setSaving(status === 'published' ? 'publish' : 'draft');
    try {
      const payload = buildPayload(status);
      if (isNew) {
        const res = await api.createProject(payload);
        setSlug(res.project.slug);
        notify(status === 'published' ? 'Project published successfully.' : 'Project saved as draft.');
        navigate(`/admin/projects/${res.project.id}`, { replace: true });
      } else {
        const res = await api.updateProject(id!, payload);
        setSlug(res.project.slug);
        notify(status === 'published' ? 'Project published successfully.' : 'Project updated successfully.');
      }
    } catch (err: any) {
      notify(err.message || 'Project could not be saved. Please try again.', 'error');
    } finally {
      setSaving(null);
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
        <h1 className="text-2xl font-semibold text-ink">{isNew ? 'Add Project' : 'Edit Project'}</h1>
        {slug && form.status === 'published' && (
          <a href={`/projects/${slug}`} target="_blank" rel="noreferrer">
            <Button variant="secondary" size="sm">
              <Eye size={14} /> Preview
            </Button>
          </a>
        )}
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Project Title" required>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Coal Stock Wash Bay — Civil Works" />
          </Field>
          <Field label="Client">
            <Input value={form.client} onChange={(e) => set('client', e.target.value)} placeholder="Eskom Holdings" />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Location" required>
            <Input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Kusile Power Station, Mpumalanga" />
          </Field>
          <Field label="Category" required hint="Type any category — new ones are created automatically.">
            <Input list="project-categories" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Civil" />
            <datalist id="project-categories">
              {KNOWN_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Completion Date / Year">
            <Input value={form.completionDate} onChange={(e) => set('completionDate', e.target.value)} placeholder="March 2024" />
          </Field>
          <Field label="Featured Project">
            <label className="flex items-center gap-2 h-[42px]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="rounded border-ink/30 text-brand-700 focus:ring-brand-700/40"
              />
              <span className="text-sm text-ink/70">Show prominently on the public site</span>
            </label>
          </Field>
        </div>

        <Field label="Short Description" required hint="A brief summary shown in project cards.">
          <TextArea rows={2} value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} />
        </Field>

        <Field label="Full Project Description" required>
          <TextArea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>

        <Field label="Scope of Work" hint="One item per line.">
          <TextArea rows={4} value={form.scope} onChange={(e) => set('scope', e.target.value)} placeholder={'Site clearance\nExcavation\nConcrete works'} />
        </Field>

        {/* Cover image */}
        <Field label="Cover Image" required>
          <div className="flex items-start gap-4">
            {cover?.url ? (
              <div className="relative h-28 w-40 rounded-lg overflow-hidden border border-ink/10 flex-shrink-0">
                <img src={cover.url} alt="Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCover(null)}
                  className="absolute top-1 right-1 bg-ink/70 text-white rounded-full p-1 hover:bg-red-600">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="h-28 w-40 rounded-lg border border-dashed border-ink/20 flex items-center justify-center flex-shrink-0 text-ink/30">
                <UploadCloud size={22} />
              </div>
            )}
            <div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg,image/heic,image/heif,.heic,.heif"
                className="hidden"
                onChange={(e) => onCoverPick(e.target.files?.[0])}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={coverUploading}
                onClick={() => coverInputRef.current?.click()}>
                {coverUploading ? 'Uploading…' : cover ? 'Replace cover image' : 'Upload cover image'}
              </Button>
              <p className="text-xs text-ink/40 mt-2">JPG, PNG, WEBP, or an iPhone HEIC photo — up to 15 MB.</p>
            </div>
          </div>
        </Field>

        {/* Gallery */}
        <Field label="Project Gallery Images">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {gallery.map((img, idx) => (
              <div key={img.url + idx} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-ink/10 group">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, -1)}
                    className="bg-white/90 rounded-full p-1.5 hover:bg-white"
                    aria-label="Move earlier">
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 1)}
                    className="bg-white/90 rounded-full p-1.5 hover:bg-white"
                    aria-label="Move later">
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="bg-white/90 rounded-full p-1.5 hover:bg-red-600 hover:text-white"
                    aria-label="Remove">
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              disabled={galleryUploading}
              onClick={() => galleryInputRef.current?.click()}
              className="aspect-[4/3] rounded-lg border border-dashed border-ink/20 flex flex-col items-center justify-center gap-1 text-ink/40 hover:border-brand-700 hover:text-brand-700 transition-colors">
              <UploadCloud size={20} />
              <span className="text-xs">{galleryUploading ? 'Uploading…' : 'Add photos'}</span>
            </button>
          </div>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg,image/heic,image/heif,.heic,.heif"
            multiple
            className="hidden"
            onChange={(e) => onGalleryPick(e.target.files)}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <Button onClick={() => save('published')} disabled={!!saving}>
          {saving === 'publish' ? 'Publishing…' : 'Publish'}
        </Button>
        <Button variant="secondary" onClick={() => save('draft')} disabled={!!saving}>
          {saving === 'draft' ? 'Saving…' : 'Save Draft'}
        </Button>
        <Button variant="ghost" onClick={() => navigate('/admin/projects')} disabled={!!saving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
