import { redirect } from 'next/navigation';

export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ lawyerId?: string }>;
}) {
  const { lawyerId } = await searchParams;

  if (lawyerId) {
    redirect(`/lawyers/${lawyerId}/book`);
  }

  redirect('/lawyers');
}
