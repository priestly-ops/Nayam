import { DocumentVault } from '@/components/documents/DocumentVault';

export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy">
      <section className="mx-auto max-w-5xl space-y-6">
        <h1 className="font-display text-4xl font-bold">Document Vault</h1>
        <DocumentVault />
      </section>
    </main>
  );
}
