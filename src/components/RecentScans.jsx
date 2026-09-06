import { Link } from "react-router-dom";
import ComplianceBadge from "./ComplianceBadge";

export default function RecentScans({ items }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Recent scans</h2>
        <Link to="/history" className="text-sm font-medium text-brand">
          View all
        </Link>
      </div>
      <ul className="space-y-3">
        {items.map((scan) => (
          <li key={scan.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
            <div>
              <p className="text-sm font-medium">{scan.product}</p>
              <p className="text-xs text-muted">{scan.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{scan.score}%</p>
              <ComplianceBadge status={scan.status} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
