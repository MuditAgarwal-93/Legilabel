import { createContext, useContext, useMemo, useState } from "react";
import { currentUser, demoResult } from "../data/demoData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [lastResult, setLastResult] = useState(demoResult);
  const [toast, setToast] = useState("");

  const value = useMemo(
    () => ({
      user: currentUser,
      uploadedFile,
      setUploadedFile,
      lastResult,
      setLastResult,
      toast,
      showToast: (message) => {
        setToast(message);
        window.setTimeout(() => setToast(""), 2200);
      },
    }),
    [uploadedFile, lastResult, toast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}
