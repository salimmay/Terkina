'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex min-h-screen items-center justify-center p-6 text-center font-mono">
        <div className="space-y-4">
          <h1 className="text-xl font-bold uppercase text-red-400">Critical System Error</h1>
          <p className="text-xs text-white/50">Root layout crashed. Please refresh or reload.</p>
          <button
            onClick={() => reset()}
            className="px-5 py-2 rounded-full bg-white text-black text-xs uppercase font-bold"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
