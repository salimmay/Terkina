'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console (or Sentry if configured)
    console.error('App Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xl mb-4">
        ⚠️
      </div>
      <h2 className="text-xl font-bold uppercase tracking-wider text-white">
        Something went wrong
      </h2>
      <p className="text-xs font-mono text-white/50 max-w-md mt-2 mb-6">
        An unexpected exception was captured. Your session remains secure.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-mono uppercase font-bold tracking-wider hover:bg-neutral-200 transition-colors"
      >
        ↻ Try Again
      </button>
    </div>
  );
}
