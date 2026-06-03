'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LawyerFilter } from '@/components/lawyers/LawyerFilter';
import { LawyerGrid } from '@/components/lawyers/LawyerGrid';
import { Logo } from '@/components/shared/Logo';
import { useLawyers } from '@/hooks/useLawyers';

export default function LawyersPage() {
  const router = useRouter();
  const { lawyers, loading, error } = useLawyers();

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main className="relative min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Back to dashboard"
        className="fixed left-5 top-5 z-[9999] inline-flex items-center gap-2 rounded-full bg-nyaay-saffron px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Back</span>
      </button>

      <section className="mx-auto max-w-7xl space-y-6 pt-14">
        <header className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-card md:flex-row md:items-center md:justify-between">
          <Logo />
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Advocate directory</p>
            <h1 className="mt-2 font-display text-4xl font-bold">Find verified legal professionals</h1>
            <p className="mt-3 text-sm leading-6 text-nyaay-muted">Search by city, language, consultation type, and legal area. NyaayMitr is a neutral directory and booking utility.</p>
          </div>
        </header>
        <LawyerFilter />
        {loading ? <div className="rounded-3xl bg-white p-6 shadow-card">Loading verified advocates...</div> : null}
        {error ? <div className="rounded-3xl bg-white p-6 text-nyaay-danger shadow-card">{error}</div> : null}
        {!loading && !error ? <LawyerGrid lawyers={lawyers} /> : null}
      </section>
    </main>
  );
}
