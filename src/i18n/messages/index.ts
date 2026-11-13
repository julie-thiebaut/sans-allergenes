import type { Locale } from "../locale";
import { en } from "./en";
import { fr, type Messages } from "./fr";

/** Every interface string, per language. Free of React, so build scripts can use it too. */
export const MESSAGES: Record<Locale, Messages> = { fr, en };

export type { Messages };
