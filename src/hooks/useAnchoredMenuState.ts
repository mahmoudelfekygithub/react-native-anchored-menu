import { useContext, useEffect, useState } from "react";
import { AnchoredMenuStateContext } from "../core/context";
import type { MenuState } from "../types";

// Polyfill for useSyncExternalStore for older React versions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useSyncExternalStore: any;
try {
  // Try to import from react (React 18+)
  const react = require("react");
  if (react.useSyncExternalStore) {
    useSyncExternalStore = react.useSyncExternalStore;
  } else {
    throw new Error("Not available");
  }
} catch {
  // Fallback for older React versions - use useState + useEffect
  useSyncExternalStore = (subscribe: (onStoreChange: () => void) => () => void, getSnapshot: () => any) => {
    const [state, setState] = useState(() => getSnapshot());
    useEffect(() => {
      const unsubscribe = subscribe(() => {
        setState(getSnapshot());
      });
      return unsubscribe;
    }, [subscribe, getSnapshot]);
    return state;
  };
}

/**
 * State selector hook.
 *
 * Usage:
 *   const isOpen = useAnchoredMenuState(s => s.isOpen)
 */
export function useAnchoredMenuState<T = MenuState>(
  selector: (state: MenuState) => T = ((s: MenuState) => s) as (state: MenuState) => T
): T {
  const store = useContext(AnchoredMenuStateContext);
  if (!store) {
    throw new Error(
      "[react-native-anchored-menu] useAnchoredMenuState must be used within an AnchoredMenuProvider. " +
        "Make sure to wrap your component tree with <AnchoredMenuProvider> or <AnchoredMenuLayer>."
    );
  }

  const getSelectedSnapshot = () => selector(store.getSnapshot());
  return useSyncExternalStore(
    store.subscribe,
    getSelectedSnapshot,
    getSelectedSnapshot
  );
}

