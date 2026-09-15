import {
  AlertCircle,
  CheckCircle2,
  FileDown,
  Lightbulb,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { generateReport } from "../utils/generateReport";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function ComplianceResult() {
  const { lastResult, showToast } = useApp();
  const navigate = useNavigate();

  const [expandedCheck, setExpandedCheck] = useState(null);
  const [expandedFix, setExpandedFix] = useState(null);

  if (!lastResult) {
    return (
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          No analysis result available
        </h2>

        <p className="mt-2 text-sm text-muted">
          Please scan a product label first.
        </p>

        <button
          type="button"
          onClick={() => navigate("/scan")}
          className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Go to Scanner
        </button>
      </div>
    );
  }

  // =========================================================
  // FIX MY LABEL SHORTCUT
  // =========================================================

  function openFirstFix() {
    const firstFixableCheck = lastResult.checks.find(
      (check) =>
        (check.status === "fail" || check.status === "review") &&
        check.fixGuidance
    );

    if (!firstFixableCheck) {
      showToast("No fix guidance is available for this assessment.");
      return;
    }

    setExpandedFix(firstFixableCheck.id);

    document
      .getElementById(`check-${firstFixableCheck.id}`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }

    // =========================================================
  // GENERATE REPORT
  // =========================================================

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* =====================================================
          FALLBACK ANALYSIS WARNING
      ====================================================== */}

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

      {/* =====================================================
          PRODUCT SUMMARY
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-muted">
          Analyzed product
        </p>

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
              Assessment score
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

      {/* =====================================================
          EXTRACTED LABEL INFORMATION
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-semibold text-slate-900">
            Extracted Label Information
          </h3>

          <p className="mt-1 text-sm text-muted">
            Information identified from the uploaded package label.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["Product Name", lastResult.productName],
            ["Manufacturer", lastResult.manufacturer],
            ["Packed By", lastResult.packedBy],
            ["Marketed By", lastResult.marketedBy],
            ["Net Quantity", lastResult.netQuantity],
            ["MRP", lastResult.mrp],
            ["Manufacturing Date", lastResult.date],
            ["Best Before / Use By", lastResult.bestBefore],
            ["Batch Number", lastResult.batchNumber],
            ["Consumer Care", lastResult.consumerCare],
            ["Country of Origin", lastResult.countryOfOrigin],
            ["Importer", lastResult.importer],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
              </p>

              <p className="mt-1 break-words text-sm font-medium text-slate-800">
                {value || "Not detected"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          VISUAL EVIDENCE
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-semibold text-slate-900">
            Visual Evidence
          </h3>

          <p className="mt-1 text-sm text-muted">
            Visual observations used by the deterministic compliance engine.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            [
              "Principal Display Panel",
              lastResult.principalDisplayPanelEvidence,
            ],
            [
              "Declaration Legibility",
              lastResult.declarationLegibilityEvidence,
            ],
          ].map(([label, evidence]) => {
            const observable = evidence?.observable === true;
            const confidence = evidence?.confidence || "unknown";

            return (
              <div
                key={label}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {label}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      Confidence: {confidence}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      observable
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {observable ? "OBSERVED" : "REVIEW"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {evidence?.observation ||
                    "No visual evidence available."}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          COMPLIANCE CHECKS
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">
              Compliance Checks
            </h3>

            <p className="mt-1 text-sm text-muted">
              Rule-by-rule assessment based on the extracted package
              information.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              PASS
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              FAIL
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              REVIEW
            </span>
          </div>
        </div>

        <ul className="mt-5 space-y-3">
          {lastResult.checks.map((check) => {
            const isPass = check.status === "pass";
            const isFail = check.status === "fail";
            const isFixable =
              (isFail || check.status === "review") &&
              check.fixGuidance;

            const statusLabel = isPass
              ? "PASS"
              : isFail
              ? "FAIL"
              : "REVIEW";

            const statusClasses = isPass
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : isFail
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-amber-200 bg-amber-50 text-amber-700";

            const isExplanationExpanded =
              expandedCheck === check.id;

            const isFixExpanded =
              expandedFix === check.id;

            return (
              <li
                key={check.id}
                id={`check-${check.id}`}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex gap-3">

                  {/* Status Icon */}
                  {isPass ? (
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-emerald-600"
                      size={21}
                    />
                  ) : (
                    <AlertCircle
                      className={`mt-0.5 shrink-0 ${
                        isFail
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                      size={21}
                    />
                  )}

                  <div className="min-w-0 flex-1">

                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                            {check.id}
                          </span>

                          <span className="text-xs text-muted">
                            {check.ruleReference}
                          </span>

                        </div>

                        <p className="mt-2 font-semibold text-slate-900">
                          {check.label}
                        </p>
                      </div>

                      {/* Status */}
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses}`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {/* Detected Value */}
                    {check.value &&
                      check.value !== "Not detected" &&
                      check.value !==
                        "Not assessed in fallback mode" && (
                        <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Detected value
                          </p>

                          <p className="mt-1 break-words text-sm font-medium text-slate-800">
                            {check.value}
                          </p>
                        </div>
                      )}

                    {/* Metadata */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        Priority: {check.priority}
                      </span>

                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        Type: {check.checkType}
                      </span>
                    </div>

                    {/* =================================================
                        EXPLAIN WHY
                    ================================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCheck(
                          isExplanationExpanded
                            ? null
                            : check.id
                        )
                      }
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                    >
                      <Lightbulb size={15} />

                      {isExplanationExpanded
                        ? "Hide explanation"
                        : "Why did LegiLabel mark this?"}

                      {isExplanationExpanded ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </button>

                    {/* Expanded Explanation */}
                    {isExplanationExpanded && (
                      <div className="mt-3 rounded-xl border border-brand/20 bg-brand-soft/30 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Engine Explanation
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {check.detail}
                        </p>

                        {check.value &&
                          check.value !== "Not detected" &&
                          check.value !==
                            "Not assessed in fallback mode" && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-slate-500">
                                Evidence used
                              </p>

                              <p className="mt-1 break-words text-sm font-medium text-slate-800">
                                {check.value}
                              </p>
                            </div>
                          )}

                        <div className="mt-3 border-t border-slate-200 pt-3">
                          <p className="text-xs text-slate-500">
                            Decision source
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-700">
                            Deterministic Legal Rule Engine
                          </p>
                        </div>
                      </div>
                    )}

                    {/* =================================================
                        FIX MY LABEL
                    ================================================== */}

                    {isFixable && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedFix(
                              isFixExpanded
                                ? null
                                : check.id
                            )
                          }
                          className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline ${
                            isFail
                              ? "text-red-600"
                              : "text-amber-600"
                          }`}
                        >
                          <Wrench size={15} />

                          {isFixExpanded
                            ? "Hide fix guidance"
                            : "Fix My Label"}

                          {isFixExpanded ? (
                            <ChevronUp size={15} />
                          ) : (
                            <ChevronDown size={15} />
                          )}
                        </button>

                        {/* Fix Guidance Panel */}
                        {isFixExpanded && (
                          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <div className="flex gap-3">
                              <div className="mt-0.5 rounded-lg bg-white p-2 shadow-sm">
                                <Wrench
                                  size={18}
                                  className="text-brand"
                                />
                              </div>

                              <div className="min-w-0 flex-1">

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Fix My Label
                                </p>

                                {/* Issue */}
                                <div className="mt-3">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Issue
                                  </p>

                                  <p className="mt-1 text-sm leading-6 text-slate-800">
                                    {check.fixGuidance.issue}
                                  </p>
                                </div>

                                {/* Action */}
                                <div className="mt-3">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    What to do
                                  </p>

                                  <p className="mt-1 text-sm leading-6 text-slate-800">
                                    {check.fixGuidance.action}
                                  </p>
                                </div>

                                {/* Legal Reference */}
                                <div className="mt-3">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Legal reference
                                  </p>

                                  <p className="mt-1 text-sm font-medium text-slate-800">
                                    {check.fixGuidance.reference}
                                  </p>
                                </div>

                                {/* Source */}
                                <div className="mt-3 border-t border-slate-200 pt-3">
                                  <p className="text-xs text-slate-500">
                                    Guidance source
                                  </p>

                                  <p className="mt-1 text-sm font-medium text-slate-700">
                                    Deterministic Legal Rule Engine
                                  </p>
                                </div>

                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* =====================================================
          ACTION BUTTONS
      ====================================================== */}

      <section className="flex flex-wrap gap-3">

        {/* Explain Why */}
        <button
          type="button"
          onClick={() => {
            const firstNonPass = lastResult.checks.find(
              (check) => check.status !== "pass"
            );

            if (firstNonPass) {
              setExpandedCheck(firstNonPass.id);

              document
                .getElementById(`check-${firstNonPass.id}`)
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
            } else if (lastResult.checks.length > 0) {
              setExpandedCheck(
                lastResult.checks[0].id
              );

              document
                .getElementById(
                  `check-${lastResult.checks[0].id}`
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:border-brand"
        >
          <Lightbulb size={16} />
          Explain Why
        </button>

        {/* Fix My Label */}
        <button
          type="button"
          onClick={openFirstFix}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:border-brand"
        >
          <Wrench size={16} />
          Fix My Label
        </button>

        {/* Generate Report */}
<button
  type="button"
onClick={() => generateReport(lastResult, showToast)}
  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
>
  <FileDown size={16} />
  Generate Report
</button>
      </section>

      {/* =====================================================
          DISCLAIMER
      ====================================================== */}

      <p className="rounded-xl bg-slate-100 px-4 py-3 text-xs text-slate-600">
        Demo assessment only. Final legal compliance should be verified
        against applicable regulations.
      </p>
    </div>
  );
}