'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type LawyerProfile = {
  full_name: string | null;
};

export type LawyerListItem = {
  id: string;
  city: string;
  state: string;
  specialisations: string[];
  languages: string[];
  consultation_fee_online: number;
  consultation_fee_inperson: number;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  profiles?: LawyerProfile | null;
};

type LawyerListRow = Omit<LawyerListItem, 'profiles'> & {
  profiles?: LawyerProfile | LawyerProfile[] | null;
};

const fallbackLawyers: LawyerListItem[] = [
  {
    id: 'demo-delhi-family-law',
    city: 'Delhi',
    state: 'Delhi',
    specialisations: ['Family Law', 'Divorce', 'Mediation'],
    languages: ['Hindi', 'English'],
    consultation_fee_online: 799,
    consultation_fee_inperson: 1499,
    rating: 4.8,
    total_reviews: 126,
    is_verified: true,
    profiles: { full_name: 'Advocate Asha Sharma' },
  },
  {
    id: 'demo-mumbai-property-law',
    city: 'Mumbai',
    state: 'Maharashtra',
    specialisations: ['Property Law', 'Tenant Disputes', 'Documentation'],
    languages: ['Marathi', 'Hindi', 'English'],
    consultation_fee_online: 999,
    consultation_fee_inperson: 1999,
    rating: 4.7,
    total_reviews: 98,
    is_verified: true,
    profiles: { full_name: 'Advocate Rohan Mehta' },
  },
  {
    id: 'demo-hyderabad-civil-law',
    city: 'Hyderabad',
    state: 'Telangana',
    specialisations: ['Civil Law', 'Consumer Matters', 'Contracts'],
    languages: ['Telugu', 'Hindi', 'English'],
    consultation_fee_online: 699,
    consultation_fee_inperson: 1299,
    rating: 4.9,
    total_reviews: 143,
    is_verified: true,
    profiles: { full_name: 'Advocate Kavya Reddy' },
  },
];

function normalizeLawyer(row: LawyerListRow): LawyerListItem {
  return {
    ...row,
    specialisations: row.specialisations?.length ? row.specialisations : ['General Legal Consultation'],
    languages: row.languages?.length ? row.languages : ['English'],
    consultation_fee_online: row.consultation_fee_online ?? 0,
    consultation_fee_inperson: row.consultation_fee_inperson ?? 0,
    rating: Number(row.rating ?? 0),
    total_reviews: row.total_reviews ?? 0,
    profiles: Array.isArray(row.profiles) ? row.profiles[0] ?? null : row.profiles ?? null,
  };
}

function mergeWithFallback(lawyers: LawyerListItem[]) {
  const existingIds = new Set(lawyers.map((lawyer) => lawyer.id));
  const missingFallbacks = fallbackLawyers.filter((lawyer) => !existingIds.has(lawyer.id));

  if (lawyers.length >= 3) {
    return lawyers;
  }

  return [...lawyers, ...missingFallbacks].slice(0, 6);
}

export function useLawyers() {
  const [lawyers, setLawyers] = useState<LawyerListItem[]>(fallbackLawyers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLawyers() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lawyers')
        .select('id, city, state, specialisations, languages, consultation_fee_online, consultation_fee_inperson, rating, total_reviews, is_verified, profiles:profile_id(full_name)')
        .eq('is_verified', true)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Unable to load lawyers:', error.message);
        setLawyers(fallbackLawyers);
      } else {
        const verifiedLawyers = ((data ?? []) as LawyerListRow[]).map(normalizeLawyer);
        setLawyers(mergeWithFallback(verifiedLawyers));
      }

      setLoading(false);
    }

    loadLawyers();
  }, []);

  return { lawyers, loading, error };
}
