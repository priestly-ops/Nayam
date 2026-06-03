import { CalendarCheck, FileText, Scale, ShieldCheck } from 'lucide-react';
import { LifecycleTracker } from '@/components/shared/LifecycleTracker';

const actions = [
  { title: 'Find Advocate', href: '/lawyers', icon: Scale },
  { title: 'Book Consultation', href: '/appointments/new', icon: CalendarCheck },
  { title: 'Upload Documents', href: '/documents', icon: FileText },
  { title: 'Legal Aid', href: '/legal-aid', icon: ShieldCheck },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <header className="rounded-3xl bg-nyaay-navy p-6 text-white shadow-soft">
            <p className="text-sm text-white/70">Namaste</p>
            <h1 className="mt-2 font-display text-4xl font-bold">How can we help today?</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Book consultations, manage documents, and track legal support securely through NyaayMitr.</p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <a key={action.title} href={action.href} className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-nyaay-saffron">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-bold">{action.title}</p>
                  <p className="mt-1 text-sm text-nyaay-muted">Continue securely</p>
                </a>
              );
            })}
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
            <p className="text-sm font-semibold text-nyaay-muted">Upcoming appointment</p>
            <h2 className="mt-2 font-display text-2xl font-bold">No confirmed appointment</h2>
            <p className="mt-2 text-sm text-nyaay-muted">Confirmed consultation details will appear here after payment verification.</p>
          </div>
          <LifecycleTracker currentStage="requested" />
        </aside>
      </section>
    </main>
  );
}
