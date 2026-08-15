'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for demo environment when live Supabase is not connected
        if (email === 'admin@terkina.com' && password === 'admin123') {
          document.cookie = 'terkina-admin-auth=true; path=/; max-age=86400';
          router.push('/crm');
          return;
        }
        setErrorMsg(error.message || 'Authentication failed');
      } else {
        document.cookie = 'terkina-admin-auth=true; path=/; max-age=86400';
        router.push('/crm');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    document.cookie = 'terkina-admin-auth=true; path=/; max-age=86400';
    router.push('/crm');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#09090b]">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl flex flex-col gap-6 shadow-2xl border border-zinc-800">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight mt-2">
            CRM Admin Portal
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Sign in to manage studio assets, projects, and gallery ordering
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@terkina.com"
                className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Access */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-col items-center gap-3 text-center">
          <span className="text-xs text-zinc-500">Evaluating local demo mode?</span>
          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Quick Access Demo Admin
          </button>
        </div>
      </div>
    </div>
  );
}
