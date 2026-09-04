import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, Copy, Trash2 } from 'lucide-react';
import * as api from '../api';
import { PageHeader, Button, Spinner, EmptyState } from '../components/ui';
import { useNotify } from '../components/Notify';

function formatSize(bytes: number | null) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Media() {
  const { notify, confirm } = useNotify();
  const [media, setMedia] = useState<api.MediaItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    api
      .listMedia()
      .then((data) => setMedia(data.media))
      .catch((err) => notify(err.message || 'Could not load media.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await api.uploadFile(file, 'media');
      }
      notify('Upload complete.');
      load();
    } catch (err: any) {
      notify(err.message || 'Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      notify('Image URL copied.');
    } catch {
      notify('Could not copy URL.', 'error');
    }
  };

  const remove = async (item: api.MediaItem) => {
    const ok = await confirm({
      title: 'Delete this image?',
      description: `"${item.filename}" will be permanently removed from storage.`,
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.deleteMedia(item.id);
      notify('Image deleted.');
      load();
    } catch (err: any) {
      if (err.status === 409) {
        const projectNames = (err.body?.usedBy || []).map((p: any) => p.title).join(', ');
        const force = await confirm({
          title: 'This image is in use',
          description: `Used by: ${projectNames || 'one or more projects'}. Delete anyway? Those projects will keep a broken image link until updated.`,
          confirmLabel: 'Delete anyway',
          danger: true,
        });
        if (force) {
          try {
            await api.deleteMedia(item.id, true);
            notify('Image deleted.');
            load();
          } catch (e: any) {
            notify(e.message || 'Could not delete image.', 'error');
          }
        }
      } else {
        notify(err.message || 'Could not delete image.', 'error');
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="Media"
        description="Images uploaded through the admin dashboard."
        actions={
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg,image/heic,image/heif,.heic,.heif"
              multiple
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
            />
            <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
              <UploadCloud size={16} /> {uploading ? 'Uploading…' : 'Upload'}
            </Button>
          </>
        }
      />

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : !media?.length ? (
        <EmptyState title="No media yet" description="Images you upload for projects and other content will appear here." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="bg-white border border-ink/10 rounded-xl overflow-hidden group">
              <div className="aspect-square bg-ink/5">
                <img src={item.url} alt={item.alt_text || item.filename} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs text-ink/60 truncate" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-[11px] text-ink/35 mb-2">{formatSize(item.size_bytes)}</p>
                <div className="flex gap-1.5">
                  <Button variant="ghost" size="sm" onClick={() => copyUrl(item.url)}>
                    <Copy size={13} /> Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(item)} className="text-red-600 hover:bg-red-50">
                    <Trash2 size={13} />
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
