import {
  AlertCircle,
  CheckCircle2,
  FileDown,
  Lightbulb,
  Wrench,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function ComplianceResult() {
  const { lastResult, showToast } = useApp();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* Fallback Analysis Warning */}
      {lastResult.analysisMode === "fallback" && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex gap-3">
            <AlertCircle
              className="mt-0.5 shrink-0 text-amber-600"
              size={22}
            />

            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">
                Basic Analysis Mode
              </h3>

              <p className="mt-1 text-sm text-amber-800">
                AI-powered analysis was unavailable for this scan. Results are
                based on basic OCR extraction and may require manual
                verification.
              </p>

              <button
                type="button"
                onClick={() => navigate("/scan")}
                className="mt-3 text-sm font-semibold text-amber-900 hover:underline"
              >
                Scan again for AI-powered analysis →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Product Summary */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-muted">Demo product</p>

        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">
              {lastResult.productName}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {lastResult.sku} · {lastResult.manufacturer}
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand-soft to-white px-5 py-4 text-right">
            <p className="text-xs uppercase tracking-wide text-muted">
              Overall score
            </p>

            <p className="text-3xl font-semibold text-brand">
              {lastResult.score}%
            </p>

            <p className="text-sm font-medium text-amber-700">
              {lastResult.status}
            </p>
          </div>
        </div>
      </section>

      {/* Individual Checks */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold">Individual checks</h3>

        <ul className="mt-4 space-y-3">
          {lastResult.checks.map((check) => (
            <li
              key={check.id}
              className="flex gap-3 rounded-xl border border-slate-100 p-4"
            >
              {check.status === "pass" ? (
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-emerald-600"
                  size={20}
                />
              ) : (
                <AlertCircle
                  className="mt-0.5 shrink-0 text-amber-600"
                  size={20}
                />
              )}

              <div>
                <p className="font-medium">{check.label}</p>
                <p className="text-sm text-muted">{check.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Action Buttons */}
      <section className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => showToast("Explain Why — coming soon.")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:border-brand"
        >
          <Lightbulb size={16} />
          Explain Why
        </button>

        <button
          type="button"
          onClick={() => showToast("Fix My Label — coming soon.")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:border-brand"
        >
          <Wrench size={16} />
          Fix My Label
        </button>

        <button
          type="button"
          onClick={() => showToast("Generate Report — demo only.")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
        >
          <FileDown size={16} />
          Generate Report
        </button>
      </section>

      {/* Disclaimer */}
      <p className="rounded-xl bg-slate-100 px-4 py-3 text-xs text-slate-600">
        Demo assessment only. Final legal compliance should be verified against
        applicable regulations.
      </p>
    </div>
  );
}