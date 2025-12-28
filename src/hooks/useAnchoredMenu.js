import { useContext, useMemo } from "react";
import {
  AnchoredMenuActionsContext,
  AnchoredMenuStateContext,
} from "../core/context";

export function useAnchoredMenu() {
  const actions = useContext(AnchoredMenuActionsContext);
  const state = useContext(AnchoredMenuStateContext);
  if (!actions || !state) throw new Error("AnchoredMenuProvider is missing");

  return useMemo(
    () => ({
      open: actions.open,
      close: actions.close,
      isOpen: state.isOpen,
    }),
    [actions.open, actions.close, state.isOpen]
  );
}
