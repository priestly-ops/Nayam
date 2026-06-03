'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type LawyerAppointment = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  lifecycle_stage: string;
  consultation_type: string;
  issue_category: string | null;
};

export default function LawyerDashboardPage() {
  const [appointments, setAppointments] = useState<LawyerAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      const { data: lawyer } = await supabase
        .from('lawyers')
        .select('id')
        .eq('profile_id', userData.user.id)
        .single();

      if (!lawyer) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('appointments')
        .select('id, appointment_date, appointment_time, status, lifecycle_stage, consultation_type, issue_category')
        .eq('lawyer_id', lawyer.id)
        .order('appointment_date', { ascending: true });

      setAppointments((data ?? []) as LawyerAppointment[]);
      setLoading(false);
    }

    loadAppointments();
  }, []);

  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-nyaay-navy p-6 text-white shadow-soft">
          <p className="text-sm text-white/70">Advocate workspace</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Lawyer Dashboard</h1>
          <p className="mt-3 text-sm text-white/70">Manage consultations, client appointments, and consultation status.</p>
        </header>

        {loading ? <p>Loading appointments...</p> : null}
        <div className="grid gap-4 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <article key={appointment.id} className="rounded-3xl bg-white p-5 shadow-card">
              <p className="text-sm font-semibold text-nyaay-saffron">{appointment.consultation_type}</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{appointment.issue_category ?? 'Legal consultation'}</h2>
              <p className="mt-2 text-sm text-nyaay-muted">{appointment.appointment_date} at {appointment.appointment_time}</p>
              <p className="mt-3 text-sm font-bold text-nyaay-navy">{appointment.status}</p>
              <p className="text-xs text-nyaay-muted">{appointment.lifecycle_stage}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
