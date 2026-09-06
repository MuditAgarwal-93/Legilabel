import { useState } from "react";
import { useApp } from "../context/AppContext";

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-brand" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}

export default function Settings() {
  const { user, showToast } = useApp();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [compactRows, setCompactRows] = useState(false);

  function save(event) {
    event.preventDefault();
    showToast("Settings saved locally in this demo.");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <form onSubmit={save} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Full name
              <input defaultValue={user.name} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              Email
              <input defaultValue={user.email} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm sm:col-span-2">
              Role
              <input defaultValue={user.role} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Company</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              Company name
              <input defaultValue={user.company} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              GSTIN
              <input defaultValue="27AABCN1234M1Z5" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              Plant location
              <input defaultValue="Pune, Maharashtra" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Notifications</h2>
          <Toggle checked={emailAlerts} onChange={setEmailAlerts} label="Email alerts for potential issues" />
          <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} label="Weekly compliance digest" />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Preferences</h2>
          <Toggle checked={compactRows} onChange={setCompactRows} label="Compact table rows" />
          <label className="mt-2 block text-sm">
            Default landing page
            <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2">
              <option>Dashboard</option>
              <option>Scan Label</option>
              <option>Inspector Mode</option>
            </select>
          </label>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Security</h2>
          <p className="mt-2 text-sm text-muted">
            Authentication is not enabled yet. These fields are placeholders for the next stage.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Current password
              <input type="password" placeholder="••••••••" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
            </label>
            <label className="text-sm">
              New password
              <input type="password" placeholder="New password" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
            </label>
          </div>
        </section>

        <button type="submit" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
          Save changes
        </button>
      </form>
    </div>
  );
}
