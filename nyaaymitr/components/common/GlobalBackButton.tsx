'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

function getFallbackHref(pathname: string) {
  if (pathname === '/login') return '/';
  if (pathname === '/') return '/login';
  if (pathname.startsWith('/register')) return '/login';
  if (pathname.startsWith('/lawyers/')) return '/lawyers';
  if (pathname.startsWith('/appointments')) return '/dashboard';
  if (pathname.startsWith('/documents')) return '/dashboard';
  if (pathname.startsWith('/admin')) return '/dashboard';
  if (pathname.startsWith('/advocate')) return '/dashboard';

  return '/dashboard';
}

function getBackLabel(pathname: string) {
  if (pathname === '/login') return 'Back to home';
  if (pathname === '/') return 'Back to login';
  if (pathname.startsWith('/register')) return 'Back to login';
  if (pathname.startsWith('/lawyers/')) return 'Back to advocate directory';
  if (pathname.startsWith('/lawyers')) return 'Back to dashboard';
  if (pathname.startsWith('/appointments')) return 'Back to dashboard';
  if (pathname.startsWith('/documents')) return 'Back to dashboard';
  if (pathname.startsWith('/admin')) return 'Back to dashboard';
  if (pathname.startsWith('/advocate')) return 'Back to client dashboard';

  return 'Back';
}

export function GlobalBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  function handleBack() {
    const fallbackHref = getFallbackHref(pathname);

    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <div className="fixed left-4 top-4 z-[9999]">
      <button
        type="button"
        onClick={handleBack}
        aria-label={getBackLabel(pathname)}
        className="inline-flex items-center gap-2 rounded-full bg-nyaay-saffron px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{getBackLabel(pathname)}</span>
        <span className="sm:hidden">Back</span>
      </button>
    </div>
  );
}
