import { NavLink, useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  FileBarChart,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  ScanLine,
  Settings,
  Shield,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/scan", label: "Scan Label", icon: ScanLine },
  { to: "/products", label: "Products", icon: Package },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/history", label: "History", icon: History },
  { to: "/inspector", label: "Inspector Mode", icon: Shield },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ onNavigate }) {
  const { user, showToast } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    showToast("Logout is demo-only. Authentication will be added later.");
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-ink">LEGILABEL</p>
            <p className="text-[11px] leading-tight text-muted">Check before you print</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-soft text-brand"
                    : "text-slate-600 hover:bg-slate-50 hover:text-ink"
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            navigate("/settings");
          }}
          className="mb-3 flex w-full items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
            AM
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.role}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
