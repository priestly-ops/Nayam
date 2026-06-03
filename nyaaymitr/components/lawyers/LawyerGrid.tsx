import { LawyerCard, type LawyerCardProps } from './LawyerCard';
import type { LawyerListItem } from '@/hooks/useLawyers';

function mapLawyer(lawyer: LawyerListItem): LawyerCardProps {
  return {
    id: lawyer.id,
    name: lawyer.profiles?.full_name ?? 'Verified Advocate',
    city: lawyer.city,
    state: lawyer.state,
    specialisations: lawyer.specialisations ?? [],
    languages: lawyer.languages ?? [],
    onlineFee: lawyer.consultation_fee_online,
    inPersonFee: lawyer.consultation_fee_inperson,
    rating: Number(lawyer.rating ?? 0),
    reviews: lawyer.total_reviews ?? 0,
    verified: lawyer.is_verified,
  };
}

export function LawyerGrid({ lawyers }: { lawyers?: LawyerListItem[] }) {
  const displayLawyers = lawyers?.map(mapLawyer) ?? [];

  if (displayLawyers.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 text-sm text-nyaay-muted shadow-card">
        No verified advocates are available yet. Please check again later.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {displayLawyers.map((lawyer) => (
        <LawyerCard key={lawyer.id} {...lawyer} />
      ))}
    </div>
  );
}
