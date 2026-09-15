import { useNavigate } from "react-router-dom";
import { Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import ComplianceBadge from "../components/ComplianceBadge";
import { useApp } from "../context/AppContext";
import { generateReport } from "../utils/generateReport";

export default function Reports() {
const navigate = useNavigate();
const { history, setLastResult, showToast } = useApp();

function openReport(item) {
  setLastResult(item);
  navigate("/result");
}
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold">Compliance reports</h2>
        <p className="text-sm text-muted">Demo files generated from mock assessments</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Report name</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">View</th>
              <th className="px-5 py-3 font-medium">Download</th>
            </tr>
          </thead>
        <tbody>
  {history.length === 0 ? (
    <tr>
      <td
        colSpan="6"
        className="px-5 py-10 text-center text-sm text-muted"
      >
        No reports generated yet. Complete a label analysis first.
      </td>
    </tr>
  ) : (
    history.map((report) => (
      <tr key={report.historyId} className="border-t border-slate-100">
        <td className="px-5 py-4 font-medium">
          LegiLabel Report
        </td>

        <td className="px-5 py-4 text-slate-600">
          {report.productName || "Product name not detected"}
        </td>

        <td className="px-5 py-4 text-slate-600">
          {report.historyDate}
        </td>

        <td className="px-5 py-4">
          <ComplianceBadge
            status={report.status || "Needs Review"}
          />
        </td>

        <td className="px-5 py-4">
          <button
            type="button"
            onClick={() => openReport(report)}
            className="inline-flex items-center gap-1 font-medium text-brand"
          >
            <Eye size={14} />
            View
          </button>
        </td>

        <td className="px-5 py-4">
          <button
            type="button"
            onClick={() => generateReport(report, showToast)}      
            className="inline-flex items-center gap-1 font-medium text-slate-700"
          >
            <Download size={14} />
            Download
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
    </div>
  );
}
