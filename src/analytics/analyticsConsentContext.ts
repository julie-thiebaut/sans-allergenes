import { createContext } from "react";
import type { AnalyticsConsent } from "./googleAnalytics";

export interface AnalyticsConsentContextValue {
  isAvailable: boolean;
  choice: AnalyticsConsent | null;
  openSettings: () => void;
}

export const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue>({
  isAvailable: false,
  choice: null,
  openSettings: () => {},
});
