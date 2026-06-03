import Link from 'next/link';
import { Gavel, Inbox } from 'lucide-react';

export default function AdvocateRequestsPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-nyaay-border/70">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-nyaay-saffron">
              <Gavel className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-nyaay-saffron">Advocate Requests</p>
              <h1 className="mt-2 font-display text-4xl font-bold">Consultation requests</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-nyaay-muted">
                New consultation requests assigned to your advocate profile will appear here.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl bg-white p-6 text-center shadow-card ring-1 ring-nyaay-border/70">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-nyaay-surface text-nyaay-muted">
            <Inbox className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold">No requests loaded yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-nyaay-muted">
            This route is now connected. The next step is to bind it to advocate-specific appointment data.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/advocate/dashboard" className="rounded-2xl bg-nyaay-navy px-5 py-3 text-sm font-bold text-white">Back to advocate dashboard</Link>
            <Link href="/lawyers" className="rounded-2xl border border-nyaay-border px-5 py-3 text-sm font-bold text-nyaay-navy">View directory</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
