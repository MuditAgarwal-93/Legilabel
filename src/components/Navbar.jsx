import { Bell, Menu, Search } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Navbar({ title, onMenuClick }) {
  const { user, showToast } = useApp();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-ink">{title}</h1>
          <p className="hidden text-xs text-muted sm:block">Check Before You Print. Comply Before You Sell.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search products, reports..."
            className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand focus:bg-white"
          />
        </label>
        <button
          type="button"
          onClick={() => showToast("No new notifications in this demo.")}
          className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand" />
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
            AM
          </div>
          <div className="hidden xl:block">
            <p className="text-sm font-medium leading-tight">{user.name}</p>
            <p className="text-xs text-muted">{user.company}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
