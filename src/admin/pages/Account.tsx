import React, { useState } from 'react';
import * as api from '../api';
import { useAuth } from '../AuthContext';
import { PageHeader, Field, Input, Button } from '../components/ui';
import { ErrorText, useNotify } from '../components/Notify';

export function Account() {
  const { admin, refresh } = useAuth();
  const { notify } = useNotify();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      await api.updateAccount({ currentPassword, newPassword });
      notify('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await refresh();
    } catch (err: any) {
      setError(err.message || 'Could not update password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg">
      <PageHeader title="Account" description="Your admin login details." />

      <div className="bg-white border border-ink/10 rounded-xl p-6 mb-5 text-sm">
        <div className="mb-3">
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1">Name</span>
          <span className="text-ink">{admin?.name || '—'}</span>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1">Email</span>
          <span className="text-ink">{admin?.email}</span>
        </div>
      </div>

      <form onSubmit={submit} className="bg-white border border-ink/10 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-ink">Change Password</h2>
        {error && <ErrorText>{error}</ErrorText>}
        <Field label="Current Password" required>
          <Input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </Field>
        <Field label="New Password" required hint="At least 8 characters.">
          <Input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </Field>
        <Field label="Confirm New Password" required>
          <Input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Field>
        <Button type="submit" disabled={saving}>
          {saving ? 'Updating…' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
}
