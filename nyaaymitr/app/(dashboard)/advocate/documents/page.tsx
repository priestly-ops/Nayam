import Link from 'next/link';
import { FileCheck2 } from 'lucide-react';
import { BackButton } from '@/components/common/BackButton';

export default function AdvocateDocumentsPage() {
  return (
    <main className="relative min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <div className="fixed left-5 top-5 z-[9999]">
        <BackButton fallbackHref="/advocate/dashboard" label="Back" variant="floating" />
      </div>

      <section className="mx-auto max-w-6xl space-y-6 pt-14">
        <header className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-nyaay-border/70">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-nyaay-saffron">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-nyaay-saffron">Advocate Documents</p>
              <h1 className="mt-2 font-display text-4xl font-bold">Client documents</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-nyaay-muted">
                Documents shared for confirmed consultations will appear in this workspace.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl bg-white p-6 text-center shadow-card ring-1 ring-nyaay-border/70">
          <h2 className="font-display text-2xl font-bold">No documents loaded yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-nyaay-muted">
            This route is connected and ready for advocate-side document review.
          </p>
          <Link href="/advocate/dashboard" className="mt-6 inline-flex rounded-2xl bg-nyaay-navy px-5 py-3 text-sm font-bold text-white">
            Back to advocate dashboard
          </Link>
        </section>
      </section>
    </main>
  );
}
