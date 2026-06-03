'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export type DocumentItem = {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  storage_path: string;
  created_at: string;
};

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDocuments() {
    setLoading(true);
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('documents')
      .select('id, file_name, file_type, file_size, storage_path, created_at')
      .eq('owner_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setDocuments((data ?? []) as DocumentItem[]);

    setLoading(false);
  }

  async function uploadLegalDocument(file: File, appointmentId?: string) {
    setError(null);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User must be signed in');

    const storagePath = `${userData.user.id}/${appointmentId ?? 'general'}/${Date.now()}-${file.name}`;

    const uploadResult = await supabase.storage
      .from('legal-documents')
      .upload(storagePath, file, { upsert: false });

    if (uploadResult.error) throw uploadResult.error;

    const insertResult = await supabase.from('documents').insert({
      owner_id: userData.user.id,
      appointment_id: appointmentId ?? null,
      file_name: file.name,
      file_type: file.type || 'application/octet-stream',
      file_size: file.size,
      storage_path: storagePath,
      is_encrypted: false,
    });

    if (insertResult.error) throw insertResult.error;
    await loadDocuments();
    return storagePath;
  }

  async function uploadPaymentProof(file: File, appointmentId: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User must be signed in');

    const storagePath = `${userData.user.id}/${appointmentId}/${Date.now()}-${file.name}`;

    const uploadResult = await supabase.storage
      .from('payment-proofs')
      .upload(storagePath, file, { upsert: false });

    if (uploadResult.error) throw uploadResult.error;
    return storagePath;
  }

  return { documents, loading, error, loadDocuments, uploadLegalDocument, uploadPaymentProof };
}
