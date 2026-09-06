import { products } from "../data/demoData";

export default function ComplianceChart() {
  const total = products.length || 1;
  const counts = {
    Compliant: products.filter((p) => p.compliance === "Compliant").length,
    "Needs Review": products.filter((p) => p.compliance === "Needs Review").length,
    "Potential Issues": products.filter((p) => p.compliance === "Potential Issues").length,
  };

  const rows = [
    { label: "Compliant", value: counts.Compliant, color: "bg-emerald-500" },
    { label: "Needs Review", value: counts["Needs Review"], color: "bg-amber-500" },
    { label: "Potential Issues", value: counts["Potential Issues"], color: "bg-rose-500" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">Compliance overview</h2>
      <p className="mt-1 text-sm text-muted">Share of demo catalogue by status</p>
      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{row.label}</span>
              <span className="text-muted">{row.value}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${row.color}`}
                style={{ width: `${Math.round((row.value / total) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
