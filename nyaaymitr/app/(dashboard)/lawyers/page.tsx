import { LawyerFilter } from '@/components/lawyers/LawyerFilter';
import { LawyerGrid } from '@/components/lawyers/LawyerGrid';
import { Logo } from '@/components/shared/Logo';

export default function LawyersPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-card md:flex-row md:items-center md:justify-between">
          <Logo />
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Advocate directory</p>
            <h1 className="mt-2 font-display text-4xl font-bold">Find verified legal professionals</h1>
            <p className="mt-3 text-sm leading-6 text-nyaay-muted">
              Search by city, language, consultation type, and legal area. NyaayMitr is a neutral directory and booking utility.
            </p>
          </div>
        </header>
        <LawyerFilter />
        <LawyerGrid />
      </section>
    </main>
  );
}
