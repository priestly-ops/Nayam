'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'floating';
};

export function BackButton({
  fallbackHref = '/',
  label = 'Back',
  className = '',
  variant = 'default',
}: BackButtonProps) {
  const router = useRouter();

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  const classes =
    variant === 'floating'
      ? 'inline-flex items-center gap-2 rounded-full bg-nyaay-saffron px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
      : 'inline-flex items-center gap-2 rounded-2xl border border-nyaay-border bg-white px-4 py-2 text-sm font-bold text-nyaay-navy shadow-card transition hover:bg-nyaay-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron';

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label}
      className={`${classes} ${className}`}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
