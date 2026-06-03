'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type PendingPayment = {
  id: string;
  amount: number;
  upi_transaction_ref: string | null;
  payment_screenshot_path: string | null;
  verification_status: string;
  created_at: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPayments() {
    setLoading(true);
    const { data } = await supabase
      .from('payments')
      .select('id, amount, upi_transaction_ref, payment_screenshot_path, verification_status, created_at')
      .eq('provider', 'upi_manual')
      .in('verification_status', ['pending', 'proof_submitted'])
      .order('created_at', { ascending: false });
    setPayments((data ?? []) as PendingPayment[]);
    setLoading(false);
  }

  async function verifyPayment(paymentId: string, verified: boolean) {
    await supabase.rpc('verify_upi_payment', {
      p_payment_id: paymentId,
      p_verified: verified,
      p_rejection_reason: verified ? null : 'Payment proof could not be verified',
    });
    await loadPayments();
  }

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy md:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-wide text-nyaay-saffron">Admin</p>
          <h1 className="mt-2 font-display text-4xl font-bold">UPI Payment Verification</h1>
        </header>
        {loading ? <p>Loading payments...</p> : null}
        <div className="grid gap-4">
          {payments.map((payment) => (
            <div key={payment.id} className="rounded-3xl bg-white p-5 shadow-card">
              <p className="font-bold">₹{payment.amount}</p>
              <p className="text-sm text-nyaay-muted">UTR: {payment.upi_transaction_ref ?? 'Not provided'}</p>
              <p className="text-sm text-nyaay-muted">Proof: {payment.payment_screenshot_path ?? 'Not uploaded'}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => verifyPayment(payment.id, true)} className="rounded-2xl bg-nyaay-success px-4 py-2 text-sm font-bold text-white">Verify</button>
                <button onClick={() => verifyPayment(payment.id, false)} className="rounded-2xl bg-nyaay-danger px-4 py-2 text-sm font-bold text-white">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
