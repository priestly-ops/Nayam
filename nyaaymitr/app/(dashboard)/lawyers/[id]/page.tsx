'use client';

import { BackButton } from '@/components/common/BackButton';

export default function LawyerProfilePage() {
  return (
    <main className="relative min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <div className="fixed left-5 top-5 z-[9999]">
        <BackButton fallbackHref="/lawyers" label="Back" variant="floating" />
      </div>

      <section className="mx-auto max-w-5xl space-y-6 pt-14">
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-nyaay-border/70">
          <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Verified Advocate</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Advocate Profile</h1>
          <p className="mt-3 text-sm text-nyaay-muted">Bar Council verified advocate profile. Public listing becomes available after verification.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-nyaay-border/70">
            <h2 className="font-display text-2xl font-bold">Professional details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div><p className="text-xs text-nyaay-muted">Specialisations</p><p className="font-semibold">Family Law, Property Law</p></div>
              <div><p className="text-xs text-nyaay-muted">Languages</p><p className="font-semibold">English, Hindi</p></div>
              <div><p className="text-xs text-nyaay-muted">Experience</p><p className="font-semibold">10 Years</p></div>
              <div><p className="text-xs text-nyaay-muted">Location</p><p className="font-semibold">New Delhi</p></div>
            </div>
          </div>

          <aside className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-nyaay-border/70">
            <p className="text-sm text-nyaay-muted">Consultation fee</p>
            <h3 className="mt-2 font-display text-3xl font-bold">₹1,000</h3>
            <a href="/appointments/new" className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-nyaay-saffron font-bold text-white">Request Consultation</a>
            <p className="mt-4 text-xs text-nyaay-muted">NyaayMitr is a directory and booking utility. Advocate selection is user-driven.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
