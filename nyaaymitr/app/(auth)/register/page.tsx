'use client';

import { useState } from 'react';
import { Scale } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { BackButton } from '@/components/common/BackButton';

type RegisterRole = 'client' | 'advocate';

const inputClass =
  'h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-nyaay-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron';

const labelClass = 'grid gap-2 text-sm font-semibold text-white';

export default function RegisterPage() {
  const [role, setRole] = useState<RegisterRole>('client');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [barCouncilId, setBarCouncilId] = useState('');
  const [barCouncilState, setBarCouncilState] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState('');
  const [specialisations, setSpecialisations] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  function normalizeIndianPhone(value: string) {
    const digits = value.replace(/\D/g, '');

    if (digits.startsWith('91') && digits.length === 12) {
      return '+' + digits;
    }

    if (digits.length === 10) {
      return '+91' + digits;
    }

    if (value.trim().startsWith('+')) {
      return value.trim();
    }

    return '+91' + digits;
  }

  function validateForm() {
    const normalizedPhone = normalizeIndianPhone(phone);

    if (fullName.trim().length < 2) {
      return 'Please enter your full name.';
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }

    if (!/^\+91\d{10}$/.test(normalizedPhone)) {
      return 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!city.trim() || !state.trim()) {
      return 'Please enter your city and state.';
    }

    if (!acceptedTerms) {
      return 'Please accept the terms and privacy policy.';
    }

    if (role === 'advocate') {
      if (!barCouncilId.trim()) {
        return 'Please enter your Bar Council ID.';
      }

      if (!barCouncilState.trim()) {
        return 'Please enter your Bar Council state.';
      }

      if (!enrollmentYear.trim() || Number.isNaN(Number(enrollmentYear))) {
        return 'Please enter a valid enrollment year.';
      }

      if (
        Number(enrollmentYear) < 1950 ||
        Number(enrollmentYear) > new Date().getFullYear()
      ) {
        return 'Please enter a realistic enrollment year.';
      }

      if (!specialisations.trim()) {
        return 'Please enter at least one specialisation.';
      }
    }

    return null;
  }

  async function handleRegister() {
    const validationError = validateForm();

    if (validationError) {
      setStatus(validationError);
      return;
    }

    const normalizedPhone = normalizeIndianPhone(phone);

    try {
      setLoading(true);
      setStatus(null);

      const { data: authData, error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone_number: normalizedPhone,
              role: role === 'advocate' ? 'lawyer' : 'client',
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      const userId = authData.user?.id;

      if (!userId) {
        setStatus('Registration started. Please verify your email, then sign in.');
        return;
      }

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        full_name: fullName.trim(),
        phone_number: normalizedPhone,
        preferred_language: preferredLanguage,
        role: role === 'advocate' ? 'lawyer' : 'client',
        city: city.trim(),
        state: state.trim(),
        is_active: true,
      });

      if (profileError) {
        throw profileError;
      }

      if (role === 'advocate') {
        const { data: lawyer, error: lawyerError } = await supabase
          .from('lawyers')
          .insert({
            profile_id: userId,
            bar_council_id: barCouncilId.trim(),
            bar_council_state: barCouncilState.trim(),
            enrollment_year: Number(enrollmentYear),
            specialisations: specialisations
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
            languages: [preferredLanguage],
            city: city.trim(),
            state: state.trim(),
            is_verified: false,
          })
          .select('id')
          .single();

        if (lawyerError) {
          throw lawyerError;
        }

        if (lawyer?.id) {
          const { error: verificationError } = await supabase
            .from('verification_requests')
            .insert({
              lawyer_id: lawyer.id,
              status: 'submitted',
              submitted_at: new Date().toISOString(),
            });

          if (verificationError) {
            throw verificationError;
          }
        }
      }

      setStatus(
        role === 'advocate'
          ? 'Account created. Your advocate profile has been submitted for verification.'
          : 'Account created. Please check your email if verification is required.'
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : 'Could not create account.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      id="register-main"
      className="min-h-screen bg-nyaay-deep px-5 py-8 text-white md:px-10"
    >
      <a
        href="#register-form"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-nyaay-navy"
      >
        Skip to registration form
      </a>

      <section
        id="register-form"
        aria-labelledby="register-heading"
        className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur"
      >
        <div className="mb-6">
          <BackButton fallbackHref="/login" label="Back to login" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-nyaay-gold/15 text-nyaay-gold">
            <Scale className="h-7 w-7" aria-hidden="true" />
          </div>

          <div>
            <p className="font-display text-2xl font-bold text-nyaay-gold">
              NyaayMitr
            </p>
            <p className="text-xs text-nyaay-muted">
              Legal help, made accessible
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">
            Create account
          </p>

          <h1
            id="register-heading"
            className="mt-2 font-display text-4xl font-bold"
          >
            Join NyaayMitr
          </h1>

          <p className="mt-3 text-sm leading-6 text-nyaay-muted">
            Register as a client or advocate. Advocate profiles become searchable
            only after verification.
          </p>
        </div>

        <div
          className="mt-8 grid gap-3 md:grid-cols-2"
          role="radiogroup"
          aria-label="Register as"
        >
          <button
            type="button"
            role="radio"
            aria-checked={role === 'client'}
            onClick={() => setRole('client')}
            className={
              role === 'client'
                ? 'rounded-2xl border border-nyaay-saffron bg-nyaay-saffron p-4 text-left font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron'
                : 'rounded-2xl border border-white/10 bg-white/5 p-4 text-left font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron'
            }
          >
            Client
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={role === 'advocate'}
            onClick={() => setRole('advocate')}
            className={
              role === 'advocate'
                ? 'rounded-2xl border border-nyaay-saffron bg-nyaay-saffron p-4 text-left font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron'
                : 'rounded-2xl border border-white/10 bg-white/5 p-4 text-left font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron'
            }
          >
            Advocate
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Full name
            <input
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClass}
              placeholder="Full name"
            />
          </label>

          <label className={labelClass}>
            Phone number
            <input
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={inputClass}
              placeholder="10-digit Indian mobile number"
            />
          </label>

          <label className={labelClass}>
            Email address
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              placeholder="name@example.com"
            />
          </label>

          <label className={labelClass}>
            Password
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              placeholder="Minimum 8 characters"
            />
          </label>

          <label className={labelClass}>
            Preferred language
            <select
              value={preferredLanguage}
              onChange={(event) => setPreferredLanguage(event.target.value)}
              className={inputClass}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Tamil</option>
              <option>Kannada</option>
              <option>Malayalam</option>
            </select>
          </label>

          <label className={labelClass}>
            City
            <input
              autoComplete="address-level2"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className={inputClass}
              placeholder="City"
            />
          </label>

          <label className={labelClass}>
            State
            <input
              autoComplete="address-level1"
              value={state}
              onChange={(event) => setState(event.target.value)}
              className={inputClass}
              placeholder="State"
            />
          </label>
        </div>

        {role === 'advocate' ? (
          <div
            className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5"
            aria-labelledby="advocate-verification-heading"
          >
            <h2
              id="advocate-verification-heading"
              className="font-display text-2xl font-bold"
            >
              Advocate verification details
            </h2>

            <p className="mt-1 text-sm text-nyaay-muted">
              These details are used for verification before listing visibility.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className={labelClass}>
                Bar Council ID
                <input
                  value={barCouncilId}
                  onChange={(event) => setBarCouncilId(event.target.value)}
                  className={inputClass}
                  placeholder="Enrollment / Bar Council ID"
                />
              </label>

              <label className={labelClass}>
                Bar Council state
                <input
                  value={barCouncilState}
                  onChange={(event) => setBarCouncilState(event.target.value)}
                  className={inputClass}
                  placeholder="State Bar Council"
                />
              </label>

              <label className={labelClass}>
                Enrollment year
                <input
                  inputMode="numeric"
                  value={enrollmentYear}
                  onChange={(event) => setEnrollmentYear(event.target.value)}
                  className={inputClass}
                  placeholder="YYYY"
                />
              </label>

              <label className={labelClass}>
                Specialisations
                <input
                  value={specialisations}
                  onChange={(event) => setSpecialisations(event.target.value)}
                  className={inputClass}
                  placeholder="Family Law, Consumer Law"
                />
              </label>
            </div>
          </div>
        ) : null}

        <label className="mt-5 flex gap-3 text-sm text-nyaay-muted focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-nyaay-saffron">
          <input
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            type="checkbox"
            className="mt-1"
          />
          <span>
            I agree to the Terms, Privacy Policy, and secure processing of my
            information.
          </span>
        </label>

        {status ? (
          <p
            className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-nyaay-muted"
            role="status"
            aria-live="polite"
          >
            {status}
          </p>
        ) : null}

        <button
          type="button"
          disabled={loading}
          onClick={handleRegister}
          className="mt-6 h-12 w-full rounded-2xl bg-nyaay-saffron font-bold text-white shadow-card disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </section>
    </main>
  );
}
