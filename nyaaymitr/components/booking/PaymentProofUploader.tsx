export function PaymentProofUploader() {
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
        <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:border-nyaay-saffron" placeholder="UTR / transaction reference" />
        <input className="h-12 rounded-2xl border border-nyaay-border px-4 text-sm outline-none focus:border-nyaay-saffron" placeholder="Amount paid" />
      </div>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-nyaay-border bg-nyaay-surface p-6 text-center text-sm text-nyaay-muted">
        Upload payment screenshot
        <input type="file" className="sr-only" accept="image/png,image/jpeg,application/pdf" />
      </label>
      <button className="mt-5 h-12 w-full rounded-2xl bg-nyaay-saffron font-bold text-white shadow-card">Submit payment proof</button>
    </section>
  );
}
