export default function StatCard({ label, value, change, accent }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className={`mt-2 text-xs font-medium ${accent || "text-brand"}`}>{change}</p>
    </article>
  );
}
