const styles = {
  Compliant: "bg-emerald-50 text-emerald-700",
  "Needs Review": "bg-amber-50 text-amber-700",
  "Potential Issues": "bg-rose-50 text-rose-700",
  Ready: "bg-emerald-50 text-emerald-700",
  "Action required": "bg-amber-50 text-amber-700",
  Archived: "bg-slate-100 text-slate-600",
};

export default function ComplianceBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
