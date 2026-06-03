export function LawyerFilter() {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nyaay-border/70">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          aria-label="Search advocates"
          placeholder="Search by legal issue, city, or language"
          className="h-12 flex-1 rounded-2xl border border-nyaay-border bg-nyaay-surface px-4 text-sm outline-none focus:border-nyaay-saffron"
        />
        <select aria-label="Specialisation" className="h-12 rounded-2xl border border-nyaay-border bg-white px-4 text-sm outline-none focus:border-nyaay-saffron">
          <option>All specialisations</option>
          <option>Family Law</option>
          <option>Property Law</option>
          <option>Consumer Law</option>
          <option>Employment Law</option>
        </select>
        <select aria-label="Consultation type" className="h-12 rounded-2xl border border-nyaay-border bg-white px-4 text-sm outline-none focus:border-nyaay-saffron">
          <option>Online or in-person</option>
          <option>Online</option>
          <option>In-person</option>
        </select>
      </div>
      <p className="mt-3 text-xs text-nyaay-muted">NyaayMitr shows directory information only. Users choose advocates independently.</p>
    </section>
  );
}
