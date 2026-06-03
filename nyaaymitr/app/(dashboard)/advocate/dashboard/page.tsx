import Link from 'next/link';
import { CalendarCheck, FileCheck2, Gavel, IndianRupee, ShieldCheck, UserCheck } from 'lucide-react';

const advocateActions = [
  {
    title: 'Consultation Requests',
    description: 'Review new client requests and manage accepted appointments.',
    href: '/advocate/requests',
    icon: Gavel,
  },
  {
    title: 'Appointments',
    description: 'Manage online and chamber consultation schedules.',
    href: '/advocate/appointments',
    icon: CalendarCheck,
  },
  {
    title: 'Document Review',
    description: 'Access client documents for confirmed consultations.',
    href: '/advocate/documents',
    icon: FileCheck2,
  },
  {
    title: 'Payment Status',
    description: 'Track consultation payment verification updates.',
    href: '/advocate/payments',
    icon: IndianRupee,
  },
];

export default function AdvocateDashboardPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-nyaay-navy p-6 text-white shadow-soft md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-nyaay-gold">Advocate Workspace</p>
              <h1 className="mt-3 font-display text-4xl font-bold">Manage your NyaayMitr consultations</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                View consultation requests, appointments, client documents, and payment verification updates from one secure dashboard.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nyaay-gold/15 text-nyaay-gold">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">Verification based access</p>
                  <p className="mt-1 text-xs text-white/60">Directory-first profile flow</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {advocateActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href} className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70 transition-all hover:-translate-y-1 hover:shadow-soft">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-nyaay-saffron">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-bold">{action.title}</p>
                <p className="mt-2 text-sm leading-6 text-nyaay-muted">{action.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-nyaay-border/70">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-nyaay-saffron">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Today&apos;s overview</h2>
                <p className="text-sm text-nyaay-muted">Your live requests and appointments will appear here.</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-nyaay-border bg-nyaay-surface p-6 text-center">
              <p className="font-bold">No active consultation queue loaded yet</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-nyaay-muted">
                Accepted consultations will be listed here with status updates after the data view is connected.
              </p>
            </div>
          </section>

          <aside className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-nyaay-border/70">
            <p className="text-sm font-semibold uppercase tracking-widest text-nyaay-saffron">Profile note</p>
            <h2 className="mt-3 font-display text-2xl font-bold">Advocate profile visibility</h2>
            <p className="mt-3 text-sm leading-6 text-nyaay-muted">
              Keep profile information factual and verification-led. Avoid promotional claims or guaranteed outcomes.
            </p>
            <Link href="/register?role=advocate" className="mt-5 block rounded-2xl bg-nyaay-saffron px-4 py-3 text-center text-sm font-bold text-white shadow-card">
              Update onboarding details
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
