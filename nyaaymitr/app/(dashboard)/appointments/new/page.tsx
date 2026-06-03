import { BookingWizard } from '@/components/booking/BookingWizard';
import { Logo } from '@/components/shared/Logo';

export default function NewAppointmentPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-card">
          <Logo />
          <div className="mt-6 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Request consultation</p>
            <h1 className="mt-2 font-display text-4xl font-bold">Book a legal consultation</h1>
            <p className="mt-3 text-sm leading-6 text-nyaay-muted">Choose consultation type, share issue details, and submit UPI proof for verification. Appointment confirmation happens only after payment verification.</p>
          </div>
        </header>
        <BookingWizard />
      </section>
    </main>
  );
}
