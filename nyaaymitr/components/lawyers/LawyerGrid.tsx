import { LawyerCard, type LawyerCardProps } from './LawyerCard';

const sampleLawyers: LawyerCardProps[] = [
  {
    id: '1',
    name: 'Adv. Priya Sharma',
    city: 'New Delhi',
    state: 'Delhi',
    specialisations: ['Family Law', 'Property Law', 'Mediation'],
    languages: ['English', 'Hindi'],
    onlineFee: 1000,
    inPersonFee: 1500,
    rating: 4.8,
    reviews: 42,
    verified: true,
  },
  {
    id: '2',
    name: 'Adv. Rajiv Mehta',
    city: 'Mumbai',
    state: 'Maharashtra',
    specialisations: ['Consumer Law', 'Civil Matters', 'Contracts'],
    languages: ['English', 'Hindi', 'Marathi'],
    onlineFee: 1200,
    inPersonFee: 1800,
    rating: 4.6,
    reviews: 31,
    verified: true,
  },
  {
    id: '3',
    name: 'Adv. Suresh Nair',
    city: 'Chennai',
    state: 'Tamil Nadu',
    specialisations: ['Employment Law', 'Tenant Issues', 'Legal Notices'],
    languages: ['English', 'Tamil', 'Malayalam'],
    onlineFee: 900,
    inPersonFee: 1400,
    rating: 4.7,
    reviews: 27,
    verified: true,
  },
];

export function LawyerGrid({ lawyers = sampleLawyers }: { lawyers?: LawyerCardProps[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {lawyers.map((lawyer) => (
        <LawyerCard key={lawyer.id} {...lawyer} />
      ))}
    </div>
  );
}
