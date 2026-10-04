import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useMapPageMemory } from "./MapPageMemoryContext";

interface SelectionContextValue {
  hoveredId: string | null;
  selectedId: string | null;
  setHoveredId: (id: string | null) => void;
  setSelectedId: (id: string | null) => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

/** Shared hover/selection channel between RestaurantCard (list) and MapView (markers). */
export function SelectionProvider({ children }: { children: ReactNode }) {
  const memory = useMapPageMemory();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // The selection is remembered (the restaurant just opened stays highlighted, and its preview
  // card is back on the mobile map); the hover is not, since the pointer has moved on.
  const [selectedId, setSelectedIdState] = useState<string | null>(memory?.selectedId ?? null);

  // Written here rather than in an effect: clicking a card in the list selects it AND leaves
  // the page in the same render, so an effect on selectedId would never get to run.
  const setSelectedId = useCallback(
    (id: string | null) => {
      if (memory) memory.selectedId = id;
      setSelectedIdState(id);
    },
    [memory],
  );

  const value = useMemo(
    () => ({ hoveredId, selectedId, setHoveredId, setSelectedId }),
    [hoveredId, selectedId, setSelectedId],
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
