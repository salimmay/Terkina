'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Label, Input, Button } from '@/components/admin/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorMsg(error.message || 'Authentication failed');
      } else {
        document.cookie = 'terkina-admin-auth=true; path=/; max-age=86400; SameSite=Lax';
        router.push('/admin');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-950 text-white">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-lg flex flex-col gap-6 border border-zinc-800">
        <div className="flex flex-col items-center text-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="TERKINA" className="w-11 h-11 object-contain" />
          <div>
            <h1 className="font-semibold text-lg text-white tracking-tight">Studio CRM</h1>
            <p className="text-zinc-500 text-xs mt-1">Sign in to manage TERKINA & MED ART</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <Label>Email</Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@terkina.com"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label>Password</Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full mt-1">
            Sign in {!loading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
