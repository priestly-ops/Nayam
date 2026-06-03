import { BookingWizard } from '@/components/booking/BookingWizard';

export default function Page({ params }: { params: { lawyerId: string } }) {
  return <BookingWizard lawyerId={params.lawyerId} />;
}
