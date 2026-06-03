import { ChevronDown, Scale } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-nyaay-deep px-4 py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,170,62,0.08),transparent_38%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[21rem] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full border-4 border-dashed border-white/10" />
      <div className="pointer-events-none absolute left-1/2 top-[15rem] h-[62rem] w-[62rem] -translate-x-1/2 rounded-full border-4 border-dashed border-white/10" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-[430px] flex-col items-center justify-between">
        <div className="w-full">
          <header className="flex flex-col items-center pt-10 text-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-nyaay-deep/30 text-nyaay-gold shadow-glow">
              <Scale className="h-24 w-24 stroke-[1.8]" />
            </div>
            <h1 className="mt-8 font-display text-6xl font-bold leading-none text-nyaay-cream drop-shadow-lg">
              Nyayam
            </h1>
            <p className="mt-5 font-devanagari text-2xl font-semibold tracking-wide text-slate-200">
              न्याय आपका
            </p>
          </header>

          <section className="mt-10 rounded-[2rem] border border-white/15 bg-nyaay-panel/90 p-6 shadow-soft backdrop-blur">
            <div className="grid grid-cols-2 rounded-2xl bg-nyaay-deep/35 p-1.5">
              <button className="rounded-xl bg-nyaay-saffron py-4 text-lg font-extrabold tracking-wide text-white shadow-card">
                Client
              </button>
              <button className="rounded-xl py-4 text-lg font-extrabold tracking-wide text-slate-200">
                Advocate
              </button>
            </div>

            <form className="mt-10 space-y-7">
              <label className="block">
                <span className="mb-2 block text-base font-extrabold tracking-[0.16em] text-nyaay-muted">
                  Language Preference
                </span>
                <div className="flex h-16 items-center justify-between rounded-xl border border-nyaay-border bg-nyaay-panelSoft px-5 text-xl text-white/95">
                  English
                  <ChevronDown className="h-6 w-6 text-nyaay-muted" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-base font-extrabold tracking-[0.16em] text-nyaay-muted">
                  Mobile or Email
                </span>
                <input
                  className="h-16 w-full rounded-xl border border-nyaay-border bg-nyaay-panelSoft px-5 text-xl text-white outline-none placeholder:text-white/30 focus:border-nyaay-gold"
                  placeholder="Enter contact details"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-base font-extrabold tracking-[0.16em] text-nyaay-muted">
                  Password
                </span>
                <input
                  type="password"
                  className="h-16 w-full rounded-xl border border-nyaay-border bg-nyaay-panelSoft px-5 text-xl text-white outline-none placeholder:text-white/30 focus:border-nyaay-gold"
                  placeholder="••••••••"
                />
              </label>

              <button className="flex h-20 w-full items-center justify-center gap-5 rounded-xl bg-gradient-to-r from-nyaay-saffron to-nyaay-saffronLight text-lg font-black uppercase tracking-[0.24em] text-nyaay-deep shadow-card">
                Enter Portal
                <span className="text-4xl leading-none">→</span>
              </button>
            </form>

            <p className="mt-9 text-center text-base font-semibold text-nyaay-muted">
              Don&apos;t have an account?{' '}
              <a href="/register" className="font-extrabold text-nyaay-cream">
                Register Now
              </a>
            </p>
          </section>
        </div>

        <footer className="mt-6 flex w-full items-center justify-center gap-8 border-t border-nyaay-danger/50 py-5 text-sm font-black uppercase tracking-[0.16em] text-red-600">
          <span className="h-3 w-3 rounded-full bg-red-600" />
          <span>24/7 Emergency Legal Aid</span>
          <span className="h-8 w-px bg-white/15" />
          <span>Dial 15100</span>
        </footer>
      </section>
    </main>
  );
}
