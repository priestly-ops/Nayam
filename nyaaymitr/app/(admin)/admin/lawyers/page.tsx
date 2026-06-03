'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type LawyerProfile = {
  full_name: string | null;
  email: string | null;
};

type PendingLawyer = {
  id: string;
  bar_council_id: string;
  bar_council_state: string;
  city: string;
  state: string;
  is_verified: boolean;
  profiles?: LawyerProfile | null;
};

type PendingLawyerRow = Omit<PendingLawyer, 'profiles'> & {
  profiles?: LawyerProfile | LawyerProfile[] | null;
};

function normalizePendingLawyer(row: PendingLawyerRow): PendingLawyer {
  return {
    ...row,
    profiles: Array.isArray(row.profiles) ? row.profiles[0] ?? null : row.profiles ?? null,
  };
}

export default function AdminLawyersPage() {
  const [lawyers, setLawyers] = useState<PendingLawyer[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLawyers() {
    setLoading(true);
    const { data } = await supabase
      .from('lawyers')
      .select('id, bar_council_id, bar_council_state, city, state, is_verified, profiles:profile_id(full_name,email)')
      .eq('is_verified', false)
      .order('created_at', { ascending: false });

    setLawyers(((data ?? []) as PendingLawyerRow[]).map(normalizePendingLawyer));
    setLoading(false);
  }

  async function approveLawyer(id: string) {
    await supabase.from('lawyers').update({ is_verified: true }).eq('id', id);
    await loadLawyers();
  }

  useEffect(() => {
    loadLawyers();
  }, []);

  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Admin</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Lawyer Verification</h1>
        </header>
        {loading ? <p>Loading lawyers...</p> : null}
        <div className="grid gap-4">
          {lawyers.map((lawyer) => (
            <article key={lawyer.id} className="rounded-3xl bg-white p-5 shadow-card">
              <h2 className="font-display text-2xl font-bold">{lawyer.profiles?.full_name ?? 'Advocate'}</h2>
              <p className="mt-1 text-sm text-nyaay-muted">{lawyer.profiles?.email}</p>
              <p className="mt-3 text-sm font-semibold">Bar Council ID: {lawyer.bar_council_id}</p>
              <p className="text-sm text-nyaay-muted">{lawyer.bar_council_state} · {lawyer.city}, {lawyer.state}</p>
              <button onClick={() => approveLawyer(lawyer.id)} className="mt-4 rounded-2xl bg-nyaay-success px-4 py-2 text-sm font-bold text-white">Approve listing</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
