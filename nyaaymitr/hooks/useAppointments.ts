'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export type AppointmentItem = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  lifecycle_stage: string;
  payment_status: string;
  consultation_type: string;
  google_meet_link: string | null;
  issue_category: string | null;
};

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAppointments() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time, status, lifecycle_stage, payment_status, consultation_type, google_meet_link, issue_category')
      .eq('client_id', userData.user.id)
      .order('appointment_date', { ascending: true });

    if (error) setError(error.message);
    else setAppointments((data ?? []) as AppointmentItem[]);
    setLoading(false);
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  return { appointments, loading, error, refresh: loadAppointments };
}
