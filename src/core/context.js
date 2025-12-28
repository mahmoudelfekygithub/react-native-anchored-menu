import React, { createContext } from "react";

/**
 * Split contexts to avoid re-rendering all anchors when `request` changes.
 *
 * - Actions context: stable references (open/close/register/unregister/anchors map)
 * - State context: request + derived values that change during open/close
 */
export const AnchoredMenuActionsContext = createContext(null);
export const AnchoredMenuStateContext = createContext(null);
