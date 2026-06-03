import { BackButton } from '@/components/common/BackButton';
import { DocumentVault } from '@/components/documents/DocumentVault';

export default function DocumentsPage() {
  return (
    <main className="relative min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy">
      <div className="fixed left-5 top-5 z-[9999]">
        <BackButton fallbackHref="/dashboard" label="Back" variant="floating" />
      </div>

      <section className="mx-auto max-w-5xl space-y-6 pt-14">
        <h1 className="font-display text-4xl font-bold">Document Vault</h1>
        <DocumentVault />
      </section>
    </main>
  );
}
