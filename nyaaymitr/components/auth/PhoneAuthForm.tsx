'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface OTPError {
  type: 'network' | 'invalid' | 'expired' | 'max_attempts' | 'other';
  message: string;
  retryable: boolean;
}

interface PhoneAuthProps {
  onSuccess?: (userId: string) => void;
  onError?: (error: OTPError) => void;
}

export function PhoneAuthForm({ onSuccess, onError }: PhoneAuthProps) {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<OTPError | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [otpSentTime, setOtpSentTime] = useState<number | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  const maxAttempts = 3;
  const otpExpiryMs = 10 * 60 * 1000; // 10 minutes
  const resendDelayMs = 30 * 1000; // 30 seconds

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const validatePhoneNumber = (number: string): boolean => {
    // Indian phone: +91 followed by 10 digits
    const phoneRegex = /^\+91[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const handleSendOTP = useCallback(async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError({
        type: 'invalid',
        message: 'Please enter a valid Indian phone number (+91 XXXXX XXXXX)',
        retryable: true,
      });
      return;
    }

    setLoading(true);
    setError(null);
    setAttemptCount(0);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorType = data.type || 'other';

        // Specific error handling
        if (errorType === 'network') {
          throw {
            type: 'network',
            message: 'Network error. Please check your connection and try again.',
            retryable: true,
          } as OTPError;
        }

        if (response.status === 429) {
          throw {
            type: 'max_attempts',
            message: 'Too many requests. Please try again in 5 minutes.',
            retryable: false,
          } as OTPError;
        }

        throw {
          type: 'other',
          message: data.message || 'Failed to send OTP. Please try again.',
          retryable: true,
        } as OTPError;
      }

      const data = await response.json();
      setStep('otp');
      setOtpSentTime(Date.now());
      setResendCountdown(resendDelayMs / 1000);
      onSuccess?.(data.sessionId);
    } catch (err: any) {
      const errorObj = err as OTPError;
      setError(errorObj);
      onError?.(errorObj);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, onSuccess, onError]);

  const handleVerifyOTP = useCallback(async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError({
        type: 'invalid',
        message: 'Please enter a valid 6-digit OTP',
        retryable: true,
      });
      return;
    }

    // Check OTP expiry
    if (otpSentTime && Date.now() - otpSentTime > otpExpiryMs) {
      setError({
        type: 'expired',
        message: 'OTP expired. Request a new one.',
        retryable: true,
      });
      setStep('phone');
      return;
    }

    if (attemptCount >= maxAttempts) {
      setError({
        type: 'max_attempts',
        message: 'Maximum attempts exceeded. Request a new OTP.',
        retryable: true,
      });
      setStep('phone');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      if (!response.ok) {
        const data = await response.json();
        const newAttempt = attemptCount + 1;
        setAttemptCount(newAttempt);

        if (response.status === 400) {
          throw {
            type: 'invalid',
            message: `Invalid OTP. ${maxAttempts - newAttempt} attempts remaining.`,
            retryable: true,
          } as OTPError;
        }

        throw {
          type: 'other',
          message: 'Verification failed. Please try again.',
          retryable: true,
        } as OTPError;
      }

      const data = await response.json();
      // Store auth token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.userId);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      const errorObj = err as OTPError;
      setError(errorObj);
      onError?.(errorObj);
    } finally {
      setLoading(false);
    }
  }, [otp, phoneNumber, otpSentTime, attemptCount, router, onError]);

  return (
    <div className="space-y-6 max-w-md mx-auto p-6">
      {/* Phone Number Input */}
      {step === 'phone' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-nyaay-navy mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 98765 43210"
              disabled={loading}
              className="w-full h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:border-nyaay-saffron focus:ring-1 focus:ring-nyaay-saffron/30 disabled:bg-gray-100"
              aria-label="Phone number"
              aria-describedby={error ? 'phone-error' : undefined}
            />
            {error && (
              <p id="phone-error" className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </p>
            )}
          </div>

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-nyaay-saffron text-white font-bold disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              'Send OTP'
            )}
          </button>

          {/* Google Login Fallback */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/auth/google')}
            className="w-full h-12 rounded-2xl border border-nyaay-border text-nyaay-navy font-bold hover:bg-nyaay-surface transition"
            aria-label="Sign in with Google"
          >
            Sign in with Google
          </button>
        </div>
      )}

      {/* OTP Input */}
      {step === 'otp' && (
        <div className="space-y-4">
          <p className="text-sm text-nyaay-muted">
            Enter the 6-digit code sent to {phoneNumber}
          </p>

          <div>
            <label htmlFor="otp" className="block text-sm font-semibold text-nyaay-navy mb-2">
              OTP <span className="text-red-500">*</span>
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              disabled={loading}
              className="w-full h-12 rounded-2xl border border-nyaay-border px-4 text-2xl text-center font-mono outline-none focus:border-nyaay-saffron focus:ring-1 focus:ring-nyaay-saffron/30 disabled:bg-gray-100"
              aria-label="One-time password"
              aria-describedby={error ? 'otp-error' : 'otp-timer'}
            />
            <p id="otp-timer" className="mt-2 text-xs text-nyaay-muted">
              OTP expires in {Math.floor(otpExpiryMs / 1000 / 60)} minutes
            </p>
            {error && (
              <p id="otp-error" className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </p>
            )}
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            className="w-full h-12 rounded-2xl bg-nyaay-saffron text-white font-bold disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>

          {/* Resend Option */}
          <div className="text-center">
            {resendCountdown > 0 ? (
              <p className="text-sm text-nyaay-muted">
                Resend OTP in {resendCountdown} seconds
              </p>
            ) : (
              <button
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setAttemptCount(0);
                  setError(null);
                }}
                className="text-sm text-nyaay-saffron font-semibold hover:underline"
              >
                Didn't receive code? Change number
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
