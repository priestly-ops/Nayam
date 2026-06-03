'use client';

import { useEffect } from 'react';
import { useDocuments } from '@/hooks/useDocuments';

export function DocumentVault() {
  const { documents, loading, loadDocuments } = useDocuments();

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
      <h3 className="font-display text-xl font-bold text-nyaay-navy">Document Vault</h3>
      <p className="mt-1 text-sm text-nyaay-muted">Securely stored legal documents.</p>
      {loading ? <p className="mt-4 text-sm text-nyaay-muted">Loading documents...</p> : null}
      <div className="mt-4 space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-2xl bg-nyaay-surface p-3">
            <p className="font-semibold text-nyaay-navy">{doc.file_name}</p>
            <p className="text-xs text-nyaay-muted">{doc.file_type}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
