import { useContext, useMemo } from "react";
import {
  AnchoredMenuActionsContext,
  AnchoredMenuStateContext,
} from "../core/context";
import { useAnchoredMenuState } from "./useAnchoredMenuState";

export function useAnchoredMenu() {
  const actions = useContext(AnchoredMenuActionsContext);
  const state = useContext(AnchoredMenuStateContext);
  if (!actions || !state) {
    throw new Error(
      "[react-native-anchored-menu] useAnchoredMenu must be used within an AnchoredMenuProvider. " +
        "Make sure to wrap your component tree with <AnchoredMenuProvider> or <AnchoredMenuLayer>."
    );
  }

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
