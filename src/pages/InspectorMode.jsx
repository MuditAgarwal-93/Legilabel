import { useState } from "react";
import { Camera, FileBarChart, Save } from "lucide-react";
import ComplianceBadge from "../components/ComplianceBadge";
import { demoResult, products } from "../data/demoData";
import { useApp } from "../context/AppContext";

export default function InspectorMode() {
  const { showToast } = useApp();
  const [selected, setSelected] = useState(products[3]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Field inspection</p>
        <h2 className="mt-2 text-2xl font-semibold">Inspector Mode</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          A simplified view for warehouse or market checks. Visually separate from the studio Scan page, but still using demo data.
        </p>
        <button
          type="button"
          onClick={() => showToast("Inspector scan is mocked. Camera/OCR comes later.")}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900"
        >
          <Camera size={16} />
          Scan product
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold">Product information</h3>
          <label className="mt-4 block text-sm text-muted">Choose a demo SKU</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            value={selected.id}
            onChange={(event) => {
              const next = products.find((item) => item.id === event.target.value);
              if (next) setSelected(next);
            }}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted">SKU</dt>
              <dd className="font-medium">{selected.sku}</dd>
            </div>
            <div>
              <dt className="text-muted">Category</dt>
              <dd className="font-medium">{selected.category}</dd>
            </div>
            <div>
              <dt className="text-muted">Net quantity</dt>
              <dd className="font-medium">{selected.netQuantity}</dd>
            </div>
            <div>
              <dt className="text-muted">Version</dt>
              <dd className="font-medium">{selected.version}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Compliance status</h3>
            <ComplianceBadge status={selected.compliance} />
          </div>
          <p className="mt-4 text-3xl font-semibold">{selected.score}%</p>
          <p className="text-sm text-muted">Last checked {selected.lastChecked}</p>
          <h4 className="mt-6 text-sm font-semibold">Findings</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {demoResult.checks.slice(0, 4).map((check) => (
              <li key={check.id}>• {check.label}: {check.status === "pass" ? "Present" : "Review"}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => showToast("Inspection saved in this demo session only.")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white"
        >
          <Save size={16} />
          Save Inspection
        </button>
        <button
          type="button"
          onClick={() => showToast("Generate Report — coming soon.")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium"
        >
          <FileBarChart size={16} />
          Generate Report
        </button>
      </div>
    </div>
  );
}
