"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type ViewMode = "table" | "grid";

const DisplayModeContext = createContext<{
  viewMode: ViewMode;
  toggleView: () => void;
}>({
  viewMode: "table",
  toggleView: () => {},
});

export const DisplayModeProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // This runs only on first render — use localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("viewMode");
      if (stored === "grid" || stored === "table") {
        return stored;
      }
    }
    return "table"; 
  });

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const toggleView = () => {
    setViewMode((prev) => (prev === "table" ? "grid" : "table"));
  };

  return (
    <DisplayModeContext.Provider value={{ viewMode, toggleView }}>
      {children}
    </DisplayModeContext.Provider>
  );
};

export const useDisplayMode = () => useContext(DisplayModeContext);
