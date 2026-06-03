import { Scale } from 'lucide-react';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-nyaay-navy text-nyaay-gold shadow-card">
        <Scale className="h-6 w-6" aria-hidden="true" />
      </div>
      {!compact && (
        <div>
          <p className="font-display text-2xl font-bold text-nyaay-navy">NyaayMitr</p>
          <p className="text-xs font-medium text-nyaay-muted">Legal help, made accessible</p>
        </div>
      )}
    </div>
  );
}
