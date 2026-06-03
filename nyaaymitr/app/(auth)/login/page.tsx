'use client';

import { useState } from 'react';
import { Scale, Globe, ChevronDown, ShieldCheck, Wallet, Lock, AlertTriangle } from 'lucide-react';

const LANGUAGES = ['English', 'हिन्दी', 'తెలుగు', 'தமிழ்', 'ಕನ್ನಡ', 'മലയാളം'];

export default function LoginPage() {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [phone, setPhone] = useState('');

  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col" style={{ backgroundColor: '#000518' }}>

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#fe6a2a', filter: 'blur(120px)' }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: '#0f1e3c', filter: 'blur(150px)' }}
        />
      </div>

      {/* Language Selector */}
      <div className="relative z-20 flex justify-end p-4 md:px-16">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderColor: 'rgba(255,255,255,0.15)',
              color: '#f8f9fa',
            }}
          >
            <Globe className="h-4 w-4" />
            <span>{selectedLang}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {langOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden shadow-2xl z-50 border"
              style={{ backgroundColor: '#0f1e3c', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/10"
                  style={{ color: lang === selectedLang ? '#fe6a2a' : '#d9e2ff' }}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center flex-grow px-5 pb-8 pt-4">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10 animate-[fadeSlideUp_0.8s_ease_both]">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-3xl mb-5 shadow-2xl"
            style={{ backgroundColor: 'rgba(212,168,67,0.12)', border: '2px solid rgba(212,168,67,0.3)' }}
          >
            <Scale className="h-12 w-12" style={{ color: '#D4A843' }} strokeWidth={1.5} />
          </div>
          <h1
            className="text-4xl font-bold text-center mb-1"
            style={{ fontFamily: 'var(--font-playfair)', color: '#D4A843', letterSpacing: '-0.01em' }}
          >
            NyaayMitr
          </h1>
          <p className="text-base text-center" style={{ color: '#b8c6ed' }}>
            Legal help, made accessible
          </p>
        </div>

        {/* Glass login card */}
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl animate-[fadeSlideUp_0.8s_0.2s_ease_both_backwards]"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          {/* Phone OTP */}
          <div className="space-y-3">
            <label className="block text-xs font-bold tracking-widest uppercase" style={{ color: '#b8c6ed' }}>
              Phone Number
            </label>
            <div className="flex gap-2">
              <div
                className="flex items-center justify-center px-4 rounded-xl text-sm font-bold flex-shrink-0"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#f8f9fa',
                  height: '52px',
                }}
              >
                +91
              </div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 rounded-xl px-4 text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#f8f9fa',
                  height: '52px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#fe6a2a';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(254,106,42,0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              className="w-full h-14 rounded-xl font-bold text-sm tracking-widest uppercase transition-all active:scale-95 hover:brightness-110 shadow-lg"
              style={{ backgroundColor: '#fe6a2a', color: '#fff' }}
            >
              Get OTP
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#75777e' }}>OR</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
          </div>

          {/* Google */}
          <button
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all active:scale-95 hover:brightness-95 mb-4"
            style={{ backgroundColor: '#fff', color: '#000518' }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Email link */}
          <div className="text-center">
            <button
              className="text-sm font-bold transition-colors hover:text-white border-b pb-0.5"
              style={{ color: '#b8c6ed', borderColor: 'rgba(184,198,237,0.3)' }}
            >
              Login via Email &amp; Password
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="w-full max-w-md mt-8 space-y-4 animate-[fadeSlideUp_0.8s_0.4s_ease_both_backwards]">
          {[
            { icon: ShieldCheck, title: 'Verified advocates', sub: 'Background checked professionals' },
            { icon: Wallet, title: 'Transparent fees', sub: 'No hidden costs, ever' },
            { icon: Lock, title: 'Secure documents', sub: 'End-to-end encrypted vault' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-4">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(254,106,42,0.15)' }}
              >
                <Icon className="h-5 w-5" style={{ color: '#fe6a2a' }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#f8f9fa' }}>{title}</p>
                <p className="text-xs" style={{ color: '#75777e' }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Emergency Aid Banner */}
      <div
        className="relative z-20 w-full py-3 px-5 flex flex-col sm:flex-row items-center justify-center gap-3"
        style={{ backgroundColor: '#fe6a2a' }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 animate-pulse" style={{ color: '#000518' }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#000518' }}>
            24/7 Emergency Legal Aid Available
          </span>
        </div>
        <button
          className="px-6 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all hover:brightness-110 active:scale-95"
          style={{ backgroundColor: '#000518', color: '#fff' }}
        >
          Connect Now
        </button>
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
