import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    const role = data.user.user_metadata?.role;
    redirect(role === 'advocate' || role === 'lawyer' ? '/advocate/dashboard' : '/dashboard');
  }

  redirect('/login');
}
