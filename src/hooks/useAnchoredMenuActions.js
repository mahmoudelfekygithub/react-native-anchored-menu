import { useContext, useMemo } from "react";
import { AnchoredMenuActionsContext } from "../core/context";

/**
 * Stable actions-only hook.
 * Components using this won't re-render when menu state changes.
 */
export function useAnchoredMenuActions() {
  const actions = useContext(AnchoredMenuActionsContext);
  if (!actions) throw new Error("AnchoredMenuProvider is missing");

  return useMemo(
    () => ({
      open: actions.open,
      close: actions.close,
    }),
    [actions.open, actions.close]
  );
}
