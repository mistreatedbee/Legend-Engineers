import React, { useEffect, useState } from 'react';
import * as api from '../api';
import { PageHeader, Field, Input, Button, Spinner } from '../components/ui';
import { useNotify } from '../components/Notify';

const FIELDS: { key: keyof api.SiteSettings; label: string; type?: string }[] = [
  { key: 'companyName', label: 'Company Name' },
  { key: 'contactEmail', label: 'General Contact Email', type: 'email' },
  { key: 'queriesEmail', label: 'Queries Email', type: 'email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'whatsapp', label: 'WhatsApp Number' },
  { key: 'address', label: 'Business Address' },
  { key: 'linkedIn', label: 'LinkedIn URL' },
  { key: 'facebook', label: 'Facebook URL' },
];

export function Settings() {
  const { notify } = useNotify();
  const [settings, setSettings] = useState<api.SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getSettings()
      .then((data) => setSettings(data.settings))
      .catch((err) => notify(err.message || 'Could not load settings.', 'error'));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await api.updateSettings(settings);
      notify('Settings updated successfully.');
    } catch (err: any) {
      notify(err.message || 'Settings could not be saved. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Website Settings" description="Public contact details shown across the website." />

      <form onSubmit={save} className="bg-white border border-ink/10 rounded-xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          {FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <Input
                type={f.type || 'text'}
                value={settings[f.key] || ''}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              />
            </Field>
          ))}
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
