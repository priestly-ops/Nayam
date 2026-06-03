import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';

export default function AdvocateAppointmentsPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-nyaay-border/70">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-nyaay-saffron">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-nyaay-saffron">Advocate Appointments</p>
              <h1 className="mt-2 font-display text-4xl font-bold">Appointment schedule</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-nyaay-muted">
                Online and chamber consultations linked to your advocate profile will appear here.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl bg-white p-6 text-center shadow-card ring-1 ring-nyaay-border/70">
          <h2 className="font-display text-2xl font-bold">No appointments loaded yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-nyaay-muted">
            This route is ready for the advocate appointment list.
          </p>
          <Link href="/advocate/dashboard" className="mt-6 inline-flex rounded-2xl bg-nyaay-navy px-5 py-3 text-sm font-bold text-white">
            Back to advocate dashboard
          </Link>
        </section>
      </section>
    </main>
  );
}
