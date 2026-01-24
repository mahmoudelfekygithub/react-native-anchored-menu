import { useContext, useMemo } from "react";
import { AnchoredMenuActionsContext } from "../core/context";
import type { OpenMenuOptions } from "../types";

/**
 * Stable actions-only hook.
 * Components using this won't re-render when menu state changes.
 */
export function useAnchoredMenuActions(): {
  open: (options: OpenMenuOptions) => void;
  close: () => void;
} {
  const actions = useContext(AnchoredMenuActionsContext);
  if (!actions) {
    throw new Error(
      "[react-native-anchored-menu] useAnchoredMenuActions must be used within an AnchoredMenuProvider. " +
        "Make sure to wrap your component tree with <AnchoredMenuProvider>."
    );
  }

  return useMemo(
    () => ({
      open: actions.open,
      close: actions.close,
    }),
    [actions.open, actions.close]
  );
}

