'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

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
  profiles?: { full_name: string | null } | null;
};

export function useLawyers() {
  const [lawyers, setLawyers] = useState<LawyerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLawyers() {
      setLoading(true);
      const { data, error } = await supabase
        .from('lawyers')
        .select('id, city, state, specialisations, languages, consultation_fee_online, consultation_fee_inperson, rating, total_reviews, is_verified, profiles:profile_id(full_name)')
        .eq('is_verified', true)
        .order('rating', { ascending: false });

      if (error) setError(error.message);
      else setLawyers((data ?? []) as LawyerListItem[]);
      setLoading(false);
    }

    loadLawyers();
  }, []);

  return { lawyers, loading, error };
}
