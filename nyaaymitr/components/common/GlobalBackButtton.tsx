'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const hiddenRoutes = ['/', '/login'];

function getFallbackHref(pathname: string) {
  if (pathname.startsWith('/register')) return '/login';
  if (pathname.startsWith('/lawyers/')) return '/lawyers';
  if (pathname.startsWith('/appointments')) return '/dashboard';
  if (pathname.startsWith('/documents')) return '/dashboard';
  if (pathname.startsWith('/admin')) return '/dashboard';
  if (pathname.startsWith('/advocate')) return '/advocate/dashboard';

  return '/dashboard';
}

function getBackLabel(pathname: string) {
  if (pathname.startsWith('/register')) return 'Back to login';
  if (pathname.startsWith('/lawyers/')) return 'Back to advocate directory';
  if (pathname.startsWith('/lawyers')) return 'Back to dashboard';
  if (pathname.startsWith('/appointments')) return 'Back to dashboard';
  if (pathname.startsWith('/documents')) return 'Back to dashboard';
  if (pathname.startsWith('/admin')) return 'Back to dashboard';
  if (pathname.startsWith('/advocate')) return 'Back to advocate dashboard';

  return 'Back';
}

export function GlobalBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(getFallbackHref(pathname));
  }

  return (
    <div className="fixed left-4 top-4 z-50">
      <button
        type="button"
        onClick={handleBack}
        aria-label={getBackLabel(pathname)}
        className="inline-flex items-center gap-2 rounded-2xl border border-nyaay-border bg-white/95 px-4 py-2 text-sm font-bold text-nyaay-navy shadow-card backdrop-blur transition hover:bg-nyaay-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{getBackLabel(pathname)}</span>
        <span className="sm:hidden">Back</span>
      </button>
    </div>
  );
}
