import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const titles = {
  "/": "Dashboard",
  "/scan": "Scan Label",
  "/result": "Compliance Result",
  "/products": "Products",
  "/reports": "Reports",
  "/history": "History",
  "/inspector": "Inspector Mode",
  "/settings": "Settings",
};

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = titles[location.pathname] || "LegiLabel";

  return (
    <div className="min-h-screen bg-page">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
        <Sidebar />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/30"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="relative z-50 h-full w-64">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <Navbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
