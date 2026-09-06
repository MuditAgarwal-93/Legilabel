import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import ComplianceBadge from "./ComplianceBadge";

export default function ProductTable({ items, onAdd }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-semibold">Product catalogue</h2>
          <p className="text-sm text-muted">Demo SKUs used for frontend review</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Add Product
        </button>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Compliance</th>
              <th className="px-5 py-3 font-medium">Last Checked</th>
              <th className="px-5 py-3 font-medium">Version</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-5 py-4">
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-muted">{item.sku}</p>
                </td>
                <td className="px-5 py-4 text-slate-600">{item.category}</td>
                <td className="px-5 py-4">
                  <ComplianceBadge status={item.compliance} />
                </td>
                <td className="px-5 py-4 text-slate-600">{item.lastChecked}</td>
                <td className="px-5 py-4 text-slate-600">{item.version}</td>
                <td className="px-5 py-4">
                  <Link to="/result" className="inline-flex items-center gap-1 text-sm font-medium text-brand">
                    <Eye size={14} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted">{item.category} · {item.version}</p>
              </div>
              <ComplianceBadge status={item.compliance} />
            </div>
            <p className="mt-3 text-xs text-muted">Last checked {item.lastChecked}</p>
            <Link to="/result" className="mt-3 inline-flex text-sm font-medium text-brand">
              View result
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
