import { Link } from "react-router-dom";
import { AlertTriangle, ScanLine } from "lucide-react";
import StatCard from "../components/StatCard";
import RecentScans from "../components/RecentScans";
import ComplianceChart from "../components/ComplianceChart";
import ComplianceBadge from "../components/ComplianceBadge";
import { products, recentScans, summaryStats } from "../data/demoData";

export default function Dashboard() {
  const attention = products.filter((p) => p.compliance !== "Compliant");

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-brand-soft p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand">LEGILABEL</p>
          <h2 className="mt-1 text-2xl font-semibold">Welcome back 👋</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Review pack labels before print and sale. This dashboard uses demo data until OCR and compliance APIs are connected.
          </p>
        </div>
        <Link
          to="/scan"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
        >
          <ScanLine size={16} />
          Scan New Label
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ComplianceChart />
        </div>
        <RecentScans items={recentScans} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600" />
          <h2 className="font-semibold">Products needing attention</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {attention.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted">{item.sku} · {item.version}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{item.score}%</span>
                <ComplianceBadge status={item.compliance} />
                <Link to="/result" className="text-sm font-medium text-brand">
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
