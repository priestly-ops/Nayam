import { BadgeCheck, Languages, MapPin, Star } from 'lucide-react';

export type LawyerCardProps = {
  id: string;
  name: string;
  city: string;
  state: string;
  specialisations: string[];
  languages: string[];
  onlineFee: number;
  inPersonFee: number;
  rating?: number;
  reviews?: number;
  verified?: boolean;
};

export function LawyerCard({ id, name, city, state, specialisations, languages, onlineFee, inPersonFee, rating = 0, reviews = 0, verified = false }: LawyerCardProps) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-bold text-nyaay-navy">{name}</h3>
            {verified ? <BadgeCheck className="h-5 w-5 text-nyaay-success" aria-label="Verified advocate" /> : null}
          </div>
          <p className="mt-2 flex items-center gap-1 text-sm text-nyaay-muted"><MapPin className="h-4 w-4" /> {city}, {state}</p>
        </div>
        <div className="rounded-2xl bg-orange-50 px-3 py-2 text-right">
          <p className="text-xs text-nyaay-muted">Online</p>
          <p className="font-bold text-nyaay-saffron">₹{onlineFee}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {specialisations.slice(0, 3).map((item) => <span key={item} className="rounded-full bg-nyaay-surface px-3 py-1 text-xs font-semibold text-nyaay-navy">{item}</span>)}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-nyaay-border pt-4 text-sm">
        <p className="flex items-center gap-1 text-nyaay-muted"><Languages className="h-4 w-4" /> {languages.join(', ')}</p>
        <p className="flex items-center gap-1 font-semibold text-nyaay-navy"><Star className="h-4 w-4 text-nyaay-gold" /> {rating.toFixed(1)} ({reviews})</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-nyaay-muted">In-person fee: ₹{inPersonFee}</p>
        <a href={`/appointments/new?lawyerId=${id}`} className="rounded-2xl bg-nyaay-navy px-4 py-2 text-sm font-bold text-white">Book</a>
      </div>
    </article>
  );
}
