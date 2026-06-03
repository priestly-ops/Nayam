const stages = [
  { key: 'requested', label: 'Requested' },
  { key: 'payment_pending', label: 'Payment Pending' },
  { key: 'payment_submitted', label: 'Proof Submitted' },
  { key: 'payment_verified', label: 'Payment Verified' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'meet_created', label: 'Meet Ready' },
  { key: 'reminder_sent', label: 'Reminder Sent' },
  { key: 'completed', label: 'Completed' },
  { key: 'reviewed', label: 'Reviewed' }
];

export function LifecycleTracker({ currentStage = 'requested' }: { currentStage?: string }) {
  const currentIndex = Math.max(0, stages.findIndex((stage) => stage.key === currentStage));
  const stageLabel = currentStage.split('_').join(' ');

  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-nyaay-muted">Appointment lifecycle</p>
          <h3 className="font-display text-xl font-bold text-nyaay-navy">Track every step</h3>
        </div>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-nyaay-saffron">{stageLabel}</span>
      </div>
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const isDone = index <= currentIndex;
          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div className={isDone ? 'h-3 w-3 rounded-full bg-nyaay-saffron' : 'h-3 w-3 rounded-full bg-nyaay-border'} />
              <p className={isDone ? 'text-sm font-semibold text-nyaay-navy' : 'text-sm text-nyaay-muted'}>{stage.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
