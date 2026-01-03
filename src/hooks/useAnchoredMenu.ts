import { useContext, useMemo } from "react";
import {
  AnchoredMenuActionsContext,
  AnchoredMenuStateContext,
} from "../core/context";
import { useAnchoredMenuState } from "./useAnchoredMenuState";

export function useAnchoredMenu() {
  const actions = useContext(AnchoredMenuActionsContext);
  const state = useContext(AnchoredMenuStateContext);
  if (!actions || !state) throw new Error("AnchoredMenuProvider is missing");

  // Use useAnchoredMenuState to properly subscribe to isOpen changes
  const isOpen = useAnchoredMenuState((s) => s.isOpen);

  return useMemo(
    () => ({
      open: actions.open,
      close: actions.close,
      isOpen,
    }),
    [actions.open, actions.close, isOpen]
  );
}
