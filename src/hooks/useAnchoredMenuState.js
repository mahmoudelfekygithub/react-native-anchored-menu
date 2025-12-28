import { useContext, useSyncExternalStore } from "react";
import { AnchoredMenuStateContext } from "../core/context";

/**
 * State selector hook.
 *
 * Usage:
 *   const isOpen = useAnchoredMenuState(s => s.isOpen)
 */
export function useAnchoredMenuState(selector = (s) => s) {
  const store = useContext(AnchoredMenuStateContext);
  if (!store) throw new Error("AnchoredMenuProvider is missing");

  const getSelectedSnapshot = () => selector(store.getSnapshot());
  return useSyncExternalStore(
    store.subscribe,
    getSelectedSnapshot,
    getSelectedSnapshot
  );
}
