'use client';

import { supabase } from '@/lib/supabase/client';

export type CreateAppointmentInput = {
  lawyerId: string;
  consultationType: 'online' | 'inperson';
  appointmentDate: string;
  appointmentTime: string;
  language: string;
  issueCategory: string;
  issueDescription: string;
  feeAmount: number;
};

export type SubmitUpiProofInput = {
  appointmentId: string;
  amount: number;
  upiId: string;
  upiPayeeName: string;
  upiTransactionRef: string;
  paymentScreenshotPath: string;
};

export function useBooking() {
  async function createAppointment(input: CreateAppointmentInput) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User must be signed in to book an appointment');

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        client_id: userData.user.id,
        lawyer_id: input.lawyerId,
        consultation_type: input.consultationType,
        appointment_date: input.appointmentDate,
        appointment_time: input.appointmentTime,
        language: input.language,
        issue_category: input.issueCategory,
        issue_description: input.issueDescription,
        fee_amount: input.feeAmount,
        payment_status: 'pending',
        lifecycle_stage: 'payment_pending',
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id as string;
  }

  async function submitUpiPaymentProof(input: SubmitUpiProofInput) {
    const { data, error } = await supabase.rpc('submit_upi_payment_proof', {
      p_appointment_id: input.appointmentId,
      p_amount: input.amount,
      p_upi_id: input.upiId,
      p_upi_payee_name: input.upiPayeeName,
      p_upi_transaction_ref: input.upiTransactionRef,
      p_payment_screenshot_path: input.paymentScreenshotPath,
    });

    if (error) throw error;
    return data as string;
  }

  return { createAppointment, submitUpiPaymentProof };
}
