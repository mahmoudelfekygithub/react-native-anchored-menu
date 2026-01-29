import { useContext, useMemo } from "react";
import { AnchoredMenuActionsContext } from "../core/context";
import type { OpenMenuOptions } from "../types";

/**
 * Actions-only hook that provides open/close functions without subscribing to menu state.
 * 
 * Use this hook when you only need to trigger menu actions and don't need to know if the menu
 * is currently open. Components using this hook will NOT re-render when menu state changes,
 * making it ideal for performance-sensitive components like buttons or list items.
 * 
 * If you need to track menu state (e.g., show loading indicator when menu is open), use
 * `useAnchoredMenu()` or combine `useAnchoredMenuActions()` with `useAnchoredMenuState()`.
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

