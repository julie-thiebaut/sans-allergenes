import { useContext } from "react";
import {
  AnalyticsConsentContext,
  type AnalyticsConsentContextValue,
} from "./analyticsConsentContext";

export function useAnalyticsConsent(): AnalyticsConsentContextValue {
  return useContext(AnalyticsConsentContext);
}
