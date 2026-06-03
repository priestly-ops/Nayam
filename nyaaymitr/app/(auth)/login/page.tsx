'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertTriangle, BriefcaseBusiness, ChevronDown, Globe, Lock, Scale, ShieldCheck, UserRound, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const LANGUAGES = ['English', 'हिन्दी', 'తెలుగు', 'தமிழ்', 'ಕನ್ನಡ', 'മലയാളം'];

type AuthMode = 'phone' | 'otp' | 'email';
type LoginRole = 'client' | 'advocate';

const fieldClass = 'h-[52px] w-full rounded-xl px-4 text-sm outline-none transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron';
const labelClass = 'block text-xs font-bold uppercase tracking-widest';

export default function LoginPage() {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('phone');
  const [role, setRole] = useState<LoginRole>('client');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const redirectPath = role === 'advocate' ? '/advocate/dashboard' : '/dashboard';

  function normalizeIndianPhone(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
    if (digits.length === 10) return `+91${digits}`;
    if (value.trim().startsWith('+')) return value.trim();
    return `+91${digits}`;
  }

  async function handleSendOtp() {
    setStatus(null);
    const normalizedPhone = normalizeIndianPhone(phone);

    if (!/^\+91\d{10}$/.test(normalizedPhone)) {
      setStatus('Enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ phone: normalizedPhone });
      if (error) throw error;
      setPhone(normalizedPhone);
      setAuthMode('otp');
      setStatus('OTP sent. Please check your phone.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setStatus(null);
    if (!otp.trim()) {
      setStatus('Enter the OTP you received.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone: normalizeIndianPhone(phone),
        token: otp.trim(),
        type: 'sms',
      });
      if (error) throw error;
      window.location.href = redirectPath;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not verify OTP.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLogin() {
    setStatus(null);
    if (!email.trim() || !password) {
      setStatus('Enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      window.location.href = redirectPath;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setStatus(null);
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}` },
      });
      if (error) throw error;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not start Google login.');
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden" style={{ backgroundColor: '#000518' }}>
      <a href="#login-form" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-nyaay-navy">
        Skip to login form
      </a>

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-10" style={{ background: '#fe6a2a', filter: 'blur(120px)' }} />
        <div className="absolute bottom-1/4 -right-32 h-[500px] w-[500px] rounded-full opacity-15" style={{ background: '#0f1e3c', filter: 'blur(150px)' }} />
      </div>

      <div className="relative z-20 flex justify-between p-4 md:px-16">
        <Link href="/" className="rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#f8f9fa' }}>
          Home
        </Link>
        <div className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            aria-controls="language-options"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: '#f8f9fa' }}
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span>{selectedLang}</span>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          {langOpen && (
            <div id="language-options" role="listbox" aria-label="Choose language" className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border shadow-2xl" style={{ backgroundColor: '#0f1e3c', borderColor: 'rgba(255,255,255,0.1)' }}>
              {LANGUAGES.map((lang) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={lang === selectedLang}
                  key={lang}
                  onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                  className="w-full px-4 py-3 text-left text-sm transition-colors hover:bg-white/10"
                  style={{ color: lang === selectedLang ? '#fe6a2a' : '#d9e2ff' }}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="relative z-10 flex flex-grow flex-col items-center px-5 pb-8 pt-4">
        <div className="mb-8 flex animate-[fadeSlideUp_0.8s_ease_both] flex-col items-center">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-3xl shadow-2xl" style={{ backgroundColor: 'rgba(212,168,67,0.12)', border: '2px solid rgba(212,168,67,0.3)' }}>
            <Scale className="h-12 w-12" style={{ color: '#D4A843' }} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h1 className="mb-1 text-center text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#D4A843', letterSpacing: '-0.01em' }}>
            NyaayMitr
          </h1>
          <p className="text-center text-base" style={{ color: '#b8c6ed' }}>Legal help, made accessible</p>
        </div>

        <section
          id="login-form"
          aria-labelledby="login-heading"
          className="w-full max-w-md animate-[fadeSlideUp_0.8s_0.2s_ease_both_backwards] rounded-2xl p-6 shadow-2xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl p-1" role="radiogroup" aria-label="Login account type" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button type="button" role="radio" aria-checked={role === 'client'} onClick={() => setRole('client')} className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold uppercase tracking-widest transition-all" style={{ backgroundColor: role === 'client' ? '#fe6a2a' : 'transparent', color: role === 'client' ? '#fff' : '#b8c6ed' }}>
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Citizen
            </button>
            <button type="button" role="radio" aria-checked={role === 'advocate'} onClick={() => setRole('advocate')} className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold uppercase tracking-widest transition-all" style={{ backgroundColor: role === 'advocate' ? '#fe6a2a' : 'transparent', color: role === 'advocate' ? '#fff' : '#b8c6ed' }}>
              <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
              Advocate
            </button>
          </div>

          <div className="mb-5 rounded-2xl p-4" style={{ backgroundColor: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.16)' }}>
            <h2 id="login-heading" className="text-sm font-bold" style={{ color: '#f8f9fa' }}>
              {role === 'advocate' ? 'Advocate login' : 'Citizen login'}
            </h2>
            <p className="mt-1 text-xs leading-5" style={{ color: '#b8c6ed' }}>
              {role === 'advocate'
                ? 'Access consultation requests, appointment schedules, payment updates, and verification status.'
                : 'Book consultations, upload documents, and track your legal support requests securely.'}
            </p>
          </div>

          {authMode !== 'email' ? (
            <div className="space-y-3">
              <label htmlFor={authMode === 'phone' ? 'phone-number' : 'otp-code'} className={labelClass} style={{ color: '#b8c6ed' }}>
                {authMode === 'phone' ? 'Phone Number' : 'Enter OTP'}
              </label>
              {authMode === 'phone' ? (
                <div className="flex gap-2">
                  <div className="flex h-[52px] flex-shrink-0 items-center justify-center rounded-xl px-4 text-sm font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#f8f9fa' }}>
                    +91
                  </div>
                  <input id="phone-number" autoComplete="tel" inputMode="tel" type="tel" placeholder="Enter mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#f8f9fa' }} />
                </div>
              ) : (
                <input id="otp-code" autoComplete="one-time-code" inputMode="numeric" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className={fieldClass} style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#f8f9fa' }} />
              )}
              <button type="button" onClick={authMode === 'phone' ? handleSendOtp : handleVerifyOtp} disabled={loading} className="h-14 w-full rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" style={{ backgroundColor: '#fe6a2a', color: '#fff' }}>
                {loading ? 'Please wait...' : authMode === 'phone' ? 'Get OTP' : `Verify OTP as ${role === 'advocate' ? 'Advocate' : 'Citizen'}`}
              </button>
              {authMode === 'otp' ? (
                <button type="button" onClick={() => setAuthMode('phone')} className="w-full text-xs font-bold" style={{ color: '#b8c6ed' }}>
                  Change phone number
                </button>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              <label htmlFor="email" className={labelClass} style={{ color: '#b8c6ed' }}>Email</label>
              <input id="email" type="email" autoComplete="email" placeholder={role === 'advocate' ? 'Advocate email' : 'Enter email'} value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#f8f9fa' }} />
              <label htmlFor="password" className={labelClass} style={{ color: '#b8c6ed' }}>Password</label>
              <input id="password" type="password" autoComplete="current-password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#f8f9fa' }} />
              <button type="button" onClick={handleEmailLogin} disabled={loading} className="h-14 w-full rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" style={{ backgroundColor: '#fe6a2a', color: '#fff' }}>
                {loading ? 'Signing in...' : role === 'advocate' ? 'Login as Advocate' : 'Login as Citizen'}
              </button>
            </div>
          )}

          {status ? <p className="mt-4 rounded-xl bg-white/5 p-3 text-sm" role="status" aria-live="polite" style={{ color: '#b8c6ed' }}>{status}</p> : null}

          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#75777e' }}>OR</span>
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
          </div>

          <button type="button" onClick={handleGoogleLogin} disabled={loading} className="mb-4 flex h-12 w-full items-center justify-center gap-3 rounded-xl text-sm font-bold transition-all hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" style={{ backgroundColor: '#fff', color: '#000518' }}>
            Continue with Google
          </button>

          <div className="space-y-3 text-center">
            <button type="button" onClick={() => setAuthMode(authMode === 'email' ? 'phone' : 'email')} className="border-b pb-0.5 text-sm font-bold transition-colors hover:text-white" style={{ color: '#b8c6ed', borderColor: 'rgba(184,198,237,0.3)' }}>
              {authMode === 'email' ? 'Login via Phone OTP' : 'Login via Email & Password'}
            </button>
            <p className="text-sm" style={{ color: '#b8c6ed' }}>
              {role === 'advocate' ? 'Not onboarded yet?' : 'New to NyaayMitr?'}{' '}
              <Link href={`/register?role=${role}`} className="font-bold underline decoration-white/30 underline-offset-4" style={{ color: '#D4A843' }}>
                {role === 'advocate' ? 'Start advocate registration' : 'Create account'}
              </Link>
            </p>
            {role === 'advocate' ? (
              <p className="text-xs leading-5" style={{ color: '#75777e' }}>
                Advocate access is for listed legal professionals. Profiles remain verification-based and are presented as an unbiased directory, not solicitation.
              </p>
            ) : null}
          </div>
        </section>

        <div className="mt-8 w-full max-w-md animate-[fadeSlideUp_0.8s_0.4s_ease_both_backwards] space-y-4">
          {[
            { icon: ShieldCheck, title: 'Verified advocates', sub: 'Background checked professionals' },
            { icon: Wallet, title: 'Transparent fees', sub: 'No hidden costs, ever' },
            { icon: Lock, title: 'Secure documents', sub: 'End-to-end encrypted vault' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(254,106,42,0.15)' }}>
                <Icon className="h-5 w-5" style={{ color: '#fe6a2a' }} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#f8f9fa' }}>{title}</p>
                <p className="text-xs" style={{ color: '#75777e' }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="relative z-20 flex w-full flex-col items-center justify-center gap-3 px-5 py-3 sm:flex-row" style={{ backgroundColor: '#fe6a2a' }}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 animate-pulse" style={{ color: '#000518' }} aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#000518' }}>24/7 Emergency Legal Aid Available</span>
        </div>
        <Link href="/legal-aid" className="rounded-full px-6 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-95" style={{ backgroundColor: '#000518', color: '#fff' }}>
          Connect Now
        </Link>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}
