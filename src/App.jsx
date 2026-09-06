import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ScanLabel from "./pages/ScanLabel";
import ComplianceResult from "./pages/ComplianceResult";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import History from "./pages/History";
import InspectorMode from "./pages/InspectorMode";
import Settings from "./pages/Settings";
import { useApp } from "./context/AppContext";

export default function App() {
  const { toast } = useApp();

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<ScanLabel />} />
          <Route path="/result" element={<ComplianceResult />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/history" element={<History />} />
          <Route path="/inspector" element={<InspectorMode />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      {toast ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </>
  );
}
