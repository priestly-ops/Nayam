'use client';

import { useEffect } from 'react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route-level application error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-nyaay-surface px-4 text-nyaay-navy">
      <section className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-card">
        <div className="mb-4 text-4xl" aria-hidden="true">⚠️</div>
        <h1 className="font-display text-2xl font-bold text-nyaay-navy">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-nyaay-muted">
          We could not load this page. Please try again, or contact support if the issue continues.
        </p>
        {error.digest ? <p className="mt-3 text-xs text-nyaay-muted">Error ID: {error.digest}</p> : null}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={reset}
            className="h-12 w-full rounded-2xl bg-nyaay-saffron font-bold text-white transition hover:bg-nyaay-saffron/90 active:bg-nyaay-saffron/80"
          >
            Try Again
          </button>
          <a
            href="/"
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-nyaay-border bg-white font-bold text-nyaay-navy transition hover:bg-nyaay-cream active:bg-nyaay-cream/80"
          >
            Go Home
          </a>
        </div>
      </section>
    </main>
  );
}
