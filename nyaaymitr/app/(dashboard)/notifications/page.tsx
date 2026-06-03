import { NotificationPanel } from '@/components/notifications/NotificationPanel';

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-nyaay-surface px-5 py-6 text-nyaay-navy">
      <section className="mx-auto max-w-4xl space-y-6">
        <h1 className="font-display text-4xl font-bold">Notifications</h1>
        <NotificationPanel />
      </section>
    </main>
  );
}
