import { createContext, useContext } from "react";
import type { MapsAdapter } from "./MapsAdapter";

export type MapsConfigState = "loading" | "disabled" | "enabled";

export interface MapsContextValue {
  configState: MapsConfigState;
  /**
   * Resolves to a mounted-ready adapter instance. In production this dynamically imports
   * GoogleMapsAdapter (only ever called once configState is "enabled"); tests supply their
   * own context value that resolves to a shared MockMapsAdapter instance instead.
   */
  createAdapter: () => Promise<MapsAdapter>;
}

export const MapsContext = createContext<MapsContextValue | null>(null);

export function useMapsContext(): MapsContextValue {
  const context = useContext(MapsContext);
  if (!context) {
    throw new Error("useMapsContext must be used within a MapsProvider");
  }
  return context;
}
