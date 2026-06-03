import { Languages, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-8 text-nyaay-navy">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-between">
        <div>
          <div className="mb-10 flex items-center justify-between">
            <Logo />
            <button aria-label="Choose language" className="rounded-full border border-nyaay-border bg-white p-3 shadow-card">
              <Languages className="h-5 w-5" />
            </button>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="mb-6 rounded-2xl bg-orange-50 p-4">
              <p className="text-sm font-semibold text-nyaay-saffron">Verified advocates. Transparent fees. Secure documents.</p>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight">Legal help, made accessible</h1>
            <p className="mt-3 text-sm leading-6 text-nyaay-muted">Sign in to find verified advocates, request consultations, upload documents, and track appointments securely.</p>
            <div className="mt-8 space-y-3">
              <button className="h-12 w-full rounded-2xl bg-nyaay-saffron font-bold text-white shadow-card">Continue with Phone OTP</button>
              <button className="h-12 w-full rounded-2xl border border-nyaay-border bg-white font-bold text-nyaay-navy">Continue with Email</button>
              <button className="h-12 w-full rounded-2xl border border-nyaay-border bg-white font-bold text-nyaay-navy">Continue with Google</button>
            </div>
            <p className="mt-5 text-center text-sm text-nyaay-muted">New to NyaayMitr? <a href="/register" className="font-bold text-nyaay-saffron">Create account</a></p>
          </div>
        </div>
        <div className="mt-8 rounded-2xl border border-nyaay-border bg-white p-4 shadow-card">
          <div className="flex gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-nyaay-success" />
            <div>
              <p className="font-bold">Privacy-first legal support</p>
              <p className="mt-1 text-sm text-nyaay-muted">Your documents and consultation details stay protected.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
