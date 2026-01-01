import { useContext, useSyncExternalStore } from "react";
import { AnchoredMenuStateContext } from "../core/context";
import type { MenuState } from "../types";

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
  if (!store) throw new Error("AnchoredMenuProvider is missing");

  const getSelectedSnapshot = () => selector(store.getSnapshot());
  return useSyncExternalStore(
    store.subscribe,
    getSelectedSnapshot,
    getSelectedSnapshot
  );
}

