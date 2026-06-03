'use client';

import { CalendarDays, FileText, Video } from 'lucide-react';
import { useState } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { PaymentProofUploader } from './PaymentProofUploader';

export function BookingWizard({ lawyerId = '00000000-0000-0000-0000-000000000000' }: { lawyerId?: string }) {
  const { createAppointment } = useBooking();
  const [consultationType, setConsultationType] = useState<'online' | 'inperson'>('online');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [language, setLanguage] = useState('English');
  const [issueCategory, setIssueCategory] = useState('Family Law');
  const [issueDescription, setIssueDescription] = useState('');
  const [appointmentId, setAppointmentId] = useState<string | undefined>();
  const [status, setStatus] = useState<string | null>(null);

  async function handleCreateAppointment() {
    try {
      const id = await createAppointment({
        lawyerId,
        consultationType,
        appointmentDate,
        appointmentTime,
        language,
        issueCategory,
        issueDescription,
        feeAmount: 1000,
      });
      setAppointmentId(id);
      setStatus('Appointment created. You can now submit UPI payment proof.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not create appointment');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section className="space-y-5">
        <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
          <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Step 1</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-nyaay-navy">Choose consultation type</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <button type="button" onClick={() => setConsultationType('online')} className={consultationType === 'online' ? 'rounded-3xl border border-nyaay-saffron bg-orange-50 p-5 text-left' : 'rounded-3xl border border-nyaay-border bg-white p-5 text-left'}>
              <Video className="h-6 w-6 text-nyaay-saffron" />
              <p className="mt-3 font-bold text-nyaay-navy">Online video consultation</p>
              <p className="mt-1 text-sm text-nyaay-muted">Secure remote consultation with Meet link after confirmation.</p>
            </button>
            <button type="button" onClick={() => setConsultationType('inperson')} className={consultationType === 'inperson' ? 'rounded-3xl border border-nyaay-saffron bg-orange-50 p-5 text-left' : 'rounded-3xl border border-nyaay-border bg-white p-5 text-left'}>
              <CalendarDays className="h-6 w-6 text-nyaay-navy" />
              <p className="mt-3 font-bold text-nyaay-navy">In-person chamber visit</p>
              <p className="mt-1 text-sm text-nyaay-muted">Visit advocate office at confirmed time and location.</p>
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
          <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Step 2</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-nyaay-navy">Time, language, and issue</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input value={appointmentDate} onChange={(event) => setAppointmentDate(event.target.value)} className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:border-nyaay-saffron" type="date" />
            <input value={appointmentTime} onChange={(event) => setAppointmentTime(event.target.value)} className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:border-nyaay-saffron" type="time" />
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:border-nyaay-saffron" aria-label="Preferred language">
              <option>English</option><option>Hindi</option><option>Telugu</option><option>Tamil</option><option>Kannada</option>
            </select>
            <select value={issueCategory} onChange={(event) => setIssueCategory(event.target.value)} className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:border-nyaay-saffron" aria-label="Issue category">
              <option>Family Law</option><option>Property Law</option><option>Consumer Law</option><option>Employment Law</option>
            </select>
          </div>
          <textarea value={issueDescription} onChange={(event) => setIssueDescription(event.target.value)} className="mt-4 min-h-32 w-full rounded-2xl border border-nyaay-border p-4 text-sm outline-none focus:border-nyaay-saffron" placeholder="Briefly describe your legal issue. Do not include unnecessary sensitive details." />
          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-nyaay-border bg-nyaay-surface p-4 text-sm text-nyaay-muted">
            <FileText className="h-5 w-5" /> Optional document upload
            <input type="file" className="sr-only" />
          </label>
          <button type="button" onClick={handleCreateAppointment} className="mt-5 h-12 w-full rounded-2xl bg-nyaay-navy font-bold text-white">Create appointment request</button>
          {status ? <p className="mt-3 text-sm text-nyaay-muted">{status}</p> : null}
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-3xl bg-nyaay-navy p-5 text-white shadow-soft">
          <p className="text-sm text-white/70">Transparent fee summary</p>
          <h3 className="mt-2 font-display text-2xl font-bold">₹1,000</h3>
          <div className="mt-4 space-y-2 text-sm text-white/75">
            <p className="flex justify-between"><span>Advocate fee</span><span>₹1,000</span></p>
            <p className="flex justify-between"><span>Platform fee</span><span>₹0</span></p>
            <p className="flex justify-between border-t border-white/10 pt-2 font-bold text-white"><span>Total</span><span>₹1,000</span></p>
          </div>
          <p className="mt-4 text-xs text-white/60">No hidden charges. Payment is verified before appointment confirmation.</p>
        </div>
        <PaymentProofUploader appointmentId={appointmentId} />
      </aside>
    </div>
  );
}
