'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, Button, Label, Input } from '@/components/admin/ui';

const MIN_LENGTH = 8;

export default function AccountSecurity() {
  const [email, setEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      setCheckingSession(false);
    }
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (newPassword.length < MIN_LENGTH) {
      toast.error(`New password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('The two new passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      toast.error('The new password must be different from the current one.');
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();

      // Re-authenticate first. Supabase lets an active session change the
      // password without proving the old one, which would mean an unattended
      // logged-in browser could be used to lock the owner out of his account.
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (reauthError) {
        toast.error('Current password is incorrect.');
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated. Use it the next time you sign in.');
    } catch (err) {
      const e = err as { message?: string };
      toast.error(`Could not update password: ${e.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (checkingSession) {
    return (
      <Card className="max-w-lg">
        <div className="text-xs text-zinc-500 py-4 text-center">Checking your session...</div>
      </Card>
    );
  }

  if (!email) {
    return (
      <Card className="max-w-lg border-amber-500/25 bg-amber-500/10">
        <p className="text-xs text-amber-300 leading-relaxed">
          <strong>No active account session.</strong> Sign out and sign back in at{' '}
          <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200">/admin/login</code>, then
          come back to change your password.
        </p>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg">
      <CardHeader
        title="Change password"
        description="Updates the password used to sign in to this CRM."
      />

      <div className="flex items-center gap-2 mb-5 text-xs text-zinc-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Signed in as <span className="text-zinc-200">{email}</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Current password</Label>
          <Input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div>
          <Label>New password</Label>
          <Input
            type="password"
            required
            autoComplete="new-password"
            minLength={MIN_LENGTH}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
          <p className="text-[11px] text-zinc-600 mt-1.5">At least {MIN_LENGTH} characters.</p>
        </div>

        <div>
          <Label>Confirm new password</Label>
          <Input
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" variant="primary" size="sm" loading={saving}>
          Update password
        </Button>
      </form>
    </Card>
  );
}
