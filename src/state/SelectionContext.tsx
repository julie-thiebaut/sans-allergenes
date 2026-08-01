import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface SelectionContextValue {
  hoveredId: string | null;
  selectedId: string | null;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

/** Shared hover/selection channel between RestaurantCard (list) and MapView (markers). */
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const value = useMemo(
    () => ({ hoveredId, selectedId, setHoveredId, setSelectedId }),
    [hoveredId, selectedId],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelectionContext(): SelectionContextValue {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelectionContext must be used within a SelectionProvider");
  }
  return context;
}
