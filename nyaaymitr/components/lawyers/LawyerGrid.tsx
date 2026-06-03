import { LawyerCard, type LawyerCardProps } from './LawyerCard';
import type { LawyerListItem } from '@/hooks/useLawyers';

const fallbackLawyers: LawyerCardProps[] = [
  { id: '1', name: 'Adv. Priya Sharma', city: 'New Delhi', state: 'Delhi', specialisations: ['Family Law', 'Property Law'], languages: ['English', 'Hindi'], onlineFee: 1000, inPersonFee: 1500, rating: 4.8, reviews: 42, verified: true }
];

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
  const displayLawyers = lawyers && lawyers.length > 0 ? lawyers.map(mapLawyer) : fallbackLawyers;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {displayLawyers.map((lawyer) => (
        <LawyerCard key={lawyer.id} {...lawyer} />
      ))}
    </div>
  );
}
