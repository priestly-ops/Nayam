'use client';

import { ArrowLeft, CalendarDays, FileText, Video } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useBooking } from '@/hooks/useBooking';
import { useDocuments } from '@/hooks/useDocuments';
import { BackButton } from '@/components/common/BackButton';
import { PaymentProofUploader } from './PaymentProofUploader';

type LawyerFee = {
  consultation_fee_online: number | null;
  consultation_fee_inperson: number | null;
};

export function BookingWizard({ lawyerId }: { lawyerId: string }) {
  const { createAppointment } = useBooking();
  const { uploadLegalDocument } = useDocuments();
  const [consultationType, setConsultationType] = useState<'online' | 'inperson'>('online');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [language, setLanguage] = useState('English');
  const [issueCategory, setIssueCategory] = useState('Family Law');
  const [issueDescription, setIssueDescription] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [lawyerFee, setLawyerFee] = useState<LawyerFee | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | undefined>();
  const [status, setStatus] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const feeAmount = consultationType === 'online'
    ? lawyerFee?.consultation_fee_online ?? 1000
    : lawyerFee?.consultation_fee_inperson ?? 1500;

  useEffect(() => {
    async function loadLawyerFee() {
      if (!lawyerId) return;
      const { data, error } = await supabase
        .from('lawyers')
        .select('consultation_fee_online, consultation_fee_inperson')
        .eq('id', lawyerId)
        .single();

      if (!error && data) setLawyerFee(data as LawyerFee);
    }

    loadLawyerFee();
  }, [lawyerId]);

  function validateBookingForm() {
    if (!lawyerId) return 'Please select an advocate before creating an appointment.';
    if (!appointmentDate) return 'Please select an appointment date.';
    if (appointmentDate < today) return 'Please select today or a future appointment date.';
    if (!appointmentTime) return 'Please select an appointment time.';
    if (!issueCategory) return 'Please select an issue category.';
    if (issueDescription.trim().length < 20) return 'Please describe your legal issue in at least 20 characters.';

    if (documentFile) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(documentFile.type)) return 'Optional document must be a PDF, PNG, JPG, or JPEG file.';
      if (documentFile.size > 10 * 1024 * 1024) return 'Optional document must be under 10 MB.';
    }

    return null;
  }

  async function handleCreateAppointment() {
    const validationError = validateBookingForm();
    if (validationError) {
      setStatus(validationError);
      return;
    }

    try {
      setCreating(true);
      setStatus(null);
      const id = await createAppointment({
        lawyerId,
        consultationType,
        appointmentDate,
        appointmentTime,
        language,
        issueCategory,
        issueDescription: issueDescription.trim(),
        feeAmount,
      });

      if (documentFile) {
        await uploadLegalDocument(documentFile, id);
      }

      setAppointmentId(id);
      setStatus(documentFile
        ? 'Appointment created and document uploaded. You can now submit UPI payment proof.'
        : 'Appointment created. You can now submit UPI payment proof.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not create appointment');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="fixed left-5 top-5 z-[9999]">
        <BackButton 
          fallbackHref={`/lawyers/${lawyerId}`} 
          label="Back to advocate profile" 
          variant="floating" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="space-y-5">
          {!lawyerId ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-900" role="alert">
              Select an advocate from the lawyer directory first. Appointment booking is disabled until a real lawyer is selected.
            </div>
          ) : null}

          <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
            <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Step 1</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-nyaay-navy">Choose consultation type</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2" role="radiogroup" aria-label="Consultation type">
              <button type="button" role="radio" aria-checked={consultationType === 'online'} onClick={() => setConsultationType('online')} className={consultationType === 'online' ? 'rounded-3xl[...]
                <Video className="h-6 w-6 text-nyaay-saffron" aria-hidden="true" />
                <p className="mt-3 font-bold text-nyaay-navy">Online video consultation</p>
                <p className="mt-1 text-sm text-nyaay-muted">Secure remote consultation with Meet link after confirmation.</p>
              </button>
              <button type="button" role="radio" aria-checked={consultationType === 'inperson'} onClick={() => setConsultationType('inperson')} className={consultationType === 'inperson' ? 'round[...]
                <CalendarDays className="h-6 w-6 text-nyaay-navy" aria-hidden="true" />
                <p className="mt-3 font-bold text-nyaay-navy">In-person chamber visit</p>
                <p className="mt-1 text-sm text-nyaay-muted">Visit advocate office at confirmed time and location.</p>
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
            <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Step 2</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-nyaay-navy">Time, language, and issue</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-nyaay-navy">
                Appointment date
                <input value={appointmentDate} min={today} onChange={(event) => setAppointmentDate(event.target.value)} className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline[...]
              </label>
              <label className="grid gap-2 text-sm font-semibold text-nyaay-navy">
                Appointment time
                <input value={appointmentTime} onChange={(event) => setAppointmentTime(event.target.value)} className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:[...]
              </label>
              <label className="grid gap-2 text-sm font-semibold text-nyaay-navy">
                Preferred language
                <select value={language} onChange={(event) => setLanguage(event.target.value)} className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:border-nyaay-[...]
                  <option>English</option><option>Hindi</option><option>Telugu</option><option>Tamil</option><option>Kannada</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-nyaay-navy">
                Issue category
                <select value={issueCategory} onChange={(event) => setIssueCategory(event.target.value)} className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:bor[...]
                  <option>Family Law</option><option>Property Law</option><option>Consumer Law</option><option>Employment Law</option>
                </select>
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-nyaay-navy">
              Brief legal issue description
              <textarea value={issueDescription} onChange={(event) => setIssueDescription(event.target.value)} className="min-h-32 w-full rounded-2xl border border-nyaay-border p-4 text-sm outlin[...]
            </label>
            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-nyaay-border bg-nyaay-surface p-4 text-sm text-nyaay-muted focus-within:outline f[...]
              <FileText className="h-5 w-5" aria-hidden="true" />
              {documentFile ? documentFile.name : 'Optional document upload (PDF, PNG, JPG up to 10 MB)'}
              <input type="file" className="sr-only" accept="application/pdf,image/png,image/jpeg" onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)} />
            </label>
            <button type="button" disabled={creating || !lawyerId} onClick={handleCreateAppointment} className="mt-5 h-12 w-full rounded-2xl bg-nyaay-navy font-bold text-white disabled:cursor-not[...]
              {creating ? 'Creating request...' : 'Create appointment request'}
            </button>
            {status ? <p className="mt-3 text-sm text-nyaay-muted" role="status" aria-live="polite">{status}</p> : null}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-nyaay-navy p-5 text-white shadow-soft">
            <p className="text-sm text-white/70">Transparent fee summary</p>
            <h3 className="mt-2 font-display text-2xl font-bold">₹{feeAmount}</h3>
            <div className="mt-4 space-y-2 text-sm text-white/75">
              <p className="flex justify-between"><span>Advocate fee</span><span>₹{feeAmount}</span></p>
              <p className="flex justify-between"><span>Platform fee</span><span>₹0</span></p>
              <p className="flex justify-between border-t border-white/10 pt-2 font-bold text-white"><span>Total</span><span>₹{feeAmount}</span></p>
            </div>
            <p className="mt-4 text-xs text-white/60">No hidden charges. Payment is verified before appointment confirmation.</p>
          </div>
          <PaymentProofUploader appointmentId={appointmentId} expectedAmount={feeAmount} />
        </aside>
      </div>
    </div>
  );
}
