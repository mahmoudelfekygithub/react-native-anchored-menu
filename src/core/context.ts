import { createContext } from "react";
import type { MenuActions, MenuStore } from "../types";

/**
 * Split contexts to avoid re-rendering all anchors when `request` changes.
 *
 * - Actions context: stable references (open/close/register/unregister/anchors map)
 * - State context: request + derived values that change during open/close
 */
export const AnchoredMenuActionsContext = createContext<MenuActions | null>(null);
export const AnchoredMenuStateContext = createContext<MenuStore | null>(null);

