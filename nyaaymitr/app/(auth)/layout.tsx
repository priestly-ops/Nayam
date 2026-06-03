import { BackButton } from '@/components/common/BackButton';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed left-5 top-5 z-[9999]">
        <BackButton fallbackHref="/" label="Back" variant="floating" />
      </div>
      {children}
    </div>
  );
}
