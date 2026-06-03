'use client';

import { useEffect, useState } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { useDocuments } from '@/hooks/useDocuments';

type PaymentProofUploaderProps = {
  appointmentId?: string;
  expectedAmount: number;
};

export function PaymentProofUploader({ appointmentId, expectedAmount }: PaymentProofUploaderProps) {
  const { uploadPaymentProof } = useDocuments();
  const { submitUpiPaymentProof } = useBooking();
  const [file, setFile] = useState<File | null>(null);
  const [utr, setUtr] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setStatus(null);
  }, [appointmentId, expectedAmount]);

  function validatePaymentForm() {
    if (!appointmentId) return 'Create an appointment before submitting payment proof.';
    if (!utr.trim() || utr.trim().length < 8) return 'Please enter a valid UTR or transaction reference.';
    if (!file) return 'Please choose a payment screenshot first.';
    if (file.size > 5 * 1024 * 1024) return 'Payment proof file must be under 5 MB.';
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) return 'Upload PNG, JPG, JPEG, or PDF only.';
    return null;
  }

  async function handleUpload() {
    const validationError = validatePaymentForm();
    if (validationError) {
      setStatus(validationError);
      return;
    }

    try {
      setUploading(true);
      setStatus(null);
      const path = await uploadPaymentProof(file!, appointmentId!);
      await submitUpiPaymentProof({
        appointmentId: appointmentId!,
        amount: expectedAmount,
        upiId: 'nyaaymitr@upi',
        upiPayeeName: 'NyaayMitr',
        upiTransactionRef: utr.trim(),
        paymentScreenshotPath: path,
      });
      setStatus('Payment proof submitted for verification.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">UPI payment proof</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-nyaay-navy">Submit transaction details</h3>
        <p className="mt-2 text-sm leading-6 text-nyaay-muted">Pay using any UPI app, then upload the screenshot and UTR/reference number for verification.</p>
      </div>
      <div className="rounded-3xl bg-nyaay-surface p-5 text-center">
        <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-3xl border-2 border-dashed border-nyaay-border bg-white text-sm font-semibold text-nyaay-muted">UPI QR</div>
        <p className="mt-4 font-bold text-nyaay-navy">nyaaymitr@upi</p>
        <p className="text-sm text-nyaay-muted">Payee: NyaayMitr</p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-nyaay-navy">
          UTR / transaction reference
          <input value={utr} onChange={(event) => setUtr(event.target.value)} className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:border-nyaay-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron" placeholder="Example: UPI123456789" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-nyaay-navy">
          Locked amount
          <input value={`₹${expectedAmount}`} readOnly aria-readonly="true" className="h-12 rounded-2xl border border-nyaay-border bg-nyaay-surface px-4 text-sm font-bold outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron" />
        </label>
      </div>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-nyaay-border bg-nyaay-surface p-6 text-center text-sm text-nyaay-muted focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-nyaay-saffron">
        {file ? file.name : 'Upload payment screenshot or PDF'}
        <span className="mt-1 text-xs">Accepted: PNG, JPG, JPEG, PDF up to 5 MB</span>
        <input type="file" className="sr-only" accept="image/png,image/jpeg,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      </label>
      <button type="button" disabled={uploading || !appointmentId} onClick={handleUpload} className="mt-5 h-12 w-full rounded-2xl bg-nyaay-saffron font-bold text-white shadow-card disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyaay-saffron">
        {uploading ? 'Submitting...' : 'Submit payment proof'}
      </button>
      {status ? <p className="mt-3 text-sm text-nyaay-muted" role="status" aria-live="polite">{status}</p> : null}
    </section>
  );
}
