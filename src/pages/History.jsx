import ComplianceBadge from "../components/ComplianceBadge";
import { historyTimeline } from "../data/demoData";

export default function History() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold">Previous label checks</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {historyTimeline.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-medium">{item.product}</p>
                <p className="text-xs text-muted">{item.date} · {item.version}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{item.score}%</span>
                <ComplianceBadge status={item.status} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <h2 className="font-semibold">Version timeline</h2>
        <ol className="mt-5 space-y-5 border-l border-slate-200 pl-5">
          {historyTimeline.map((item) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-brand" />
              <p className="text-sm font-medium">{item.version} · {item.product}</p>
              <p className="text-xs text-muted">{item.date}</p>
              <p className="mt-1 text-sm text-slate-600">{item.note}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
