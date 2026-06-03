import { Logo } from '@/components/shared/Logo';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-8 text-nyaay-navy md:px-10">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-card">
        <Logo />
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Create account</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Join NyaayMitr</h1>
          <p className="mt-3 text-sm leading-6 text-nyaay-muted">Register as a client or advocate. Advocate profiles become searchable only after verification.</p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <button className="rounded-2xl border border-nyaay-saffron bg-orange-50 p-4 text-left font-bold">Client</button>
          <button className="rounded-2xl border border-nyaay-border bg-white p-4 text-left font-bold">Advocate</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm" placeholder="Full name" />
          <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm" placeholder="Phone number" />
          <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm" placeholder="Email address" />
          <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm" placeholder="Preferred language" />
          <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm" placeholder="City" />
          <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm" placeholder="State" />
        </div>

        <div className="mt-8 rounded-3xl bg-nyaay-surface p-5">
          <h2 className="font-display text-2xl font-bold">Advocate verification details</h2>
          <p className="mt-1 text-sm text-nyaay-muted">Fill this section only when registering as an advocate.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm" placeholder="Bar Council ID" />
            <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm" placeholder="Bar Council State" />
            <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm" placeholder="Enrollment year" />
            <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm" placeholder="Specialisations" />
          </div>
        </div>

        <label className="mt-5 flex gap-3 text-sm text-nyaay-muted">
          <input type="checkbox" className="mt-1" />
          I agree to the Terms, Privacy Policy, and secure processing of my information.
        </label>
        <button className="mt-6 h-12 w-full rounded-2xl bg-nyaay-saffron font-bold text-white shadow-card">Create account</button>
      </section>
    </main>
  );
}
