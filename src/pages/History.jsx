import ComplianceBadge from "../components/ComplianceBadge";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const { history, setLastResult } = useApp();

  function openAnalysis(item) {
    setLastResult(item);
    navigate("/result");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold">Previous label checks</h2>
        </div>

        {history.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="font-medium text-slate-700">
              No label checks yet
            </p>
            <p className="mt-1 text-sm text-muted">
              Completed label analyses will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {history.map((item) => (
              <li
                key={item.historyId}
                 onClick={() => openAnalysis(item)}
                  className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50"
                 >
                <div>
                  <p className="font-medium">
                    {item.productName || "Product name not detected"}
                  </p>

                  <p className="text-xs text-muted">
                    {item.historyDate}
                    {" · "}
                    {item.productCategory || "Unknown category"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">
                    {typeof item.score === "number"
                      ? `${item.score}%`
                      : "—"}
                  </span>

                  <ComplianceBadge
                    status={item.status || "Needs Review"}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <h2 className="font-semibold">Latest analysis</h2>

        {history.length === 0 ? (
          <p className="mt-5 text-sm text-muted">
            No completed analyses yet.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {history.slice(0, 5).map((item) => (
             <div
  key={item.historyId}
  onClick={() => openAnalysis(item)}
  className="cursor-pointer border-l-2 border-brand pl-4 transition hover:bg-slate-50"
>
                <p className="text-sm font-medium">
                  {item.productName || "Product name not detected"}
                </p>

                <p className="mt-1 text-xs text-muted">
                  {item.historyDate}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {typeof item.score === "number"
                      ? `${item.score}%`
                      : "Score unavailable"}
                  </span>

                  <ComplianceBadge
                    status={item.status || "Needs Review"}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}