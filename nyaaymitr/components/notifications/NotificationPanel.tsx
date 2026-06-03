'use client';

import { useNotifications } from '@/hooks/useNotifications';

export function NotificationPanel() {
  const { notifications, loading } = useNotifications();

  return (
    <section className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-nyaay-muted">Notifications</p>
          <h3 className="font-display text-xl font-bold text-nyaay-navy">Latest updates</h3>
        </div>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-nyaay-saffron">Live</span>
      </div>
      {loading ? <p className="text-sm text-nyaay-muted">Loading notifications...</p> : null}
      {!loading && notifications.length === 0 ? <p className="text-sm text-nyaay-muted">No notifications yet.</p> : null}
      <div className="space-y-3">
        {notifications.slice(0, 5).map((item) => (
          <div key={item.id} className="rounded-2xl bg-nyaay-surface p-3">
            <p className="text-sm font-bold text-nyaay-navy">{item.title}</p>
            <p className="mt-1 text-xs text-nyaay-muted">{item.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
