import Link from 'next/link';
import { AlertTriangle, FileText, PhoneCall, Scale, ShieldCheck } from 'lucide-react';

const supportOptions = [
  {
    title: 'Find an advocate',
    description: 'Browse the neutral advocate directory and choose a consultation slot.',
    href: '/lawyers',
    icon: Scale,
  },
  {
    title: 'Upload documents',
    description: 'Use the secure document vault before or after booking a consultation.',
    href: '/documents',
    icon: FileText,
  },
  {
    title: 'Track appointment',
    description: 'Return to your dashboard to see request, payment, and confirmation status.',
    href: '/dashboard',
    icon: ShieldCheck,
  },
];

export default function LegalAidPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-nyaay-navy p-6 text-white shadow-soft md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-nyaay-saffron text-white">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-nyaay-gold">Legal Aid</p>
              <h1 className="mt-2 font-display text-4xl font-bold">Get guided legal support</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Start with the right next step: find an advocate, upload documents, or track your consultation request.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {supportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.title} href={option.href} className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70 transition-all hover:-translate-y-1 hover:shadow-soft">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-nyaay-saffron">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-bold">{option.title}</p>
                <p className="mt-2 text-sm leading-6 text-nyaay-muted">{option.description}</p>
              </Link>
            );
          })}
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-nyaay-border/70">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Need urgent help?</h2>
              <p className="mt-2 text-sm leading-6 text-nyaay-muted">
                Use this page as a guided intake area. Avoid sharing unnecessary sensitive details until you are inside a secure consultation flow.
              </p>
            </div>
            <Link href="/lawyers" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-nyaay-saffron px-5 py-3 text-sm font-bold text-white shadow-card">
              <PhoneCall className="h-4 w-4" />
              Connect Now
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
