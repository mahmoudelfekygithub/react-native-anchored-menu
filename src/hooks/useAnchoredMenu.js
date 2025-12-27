import { useCallback, useContext, useMemo } from "react";
import { AnchoredMenuContext } from "../core/context";

/**
 * useAnchoredMenu
 *
 * Returns:
 * - open(payload)
 * - close()
 * - isOpen
 * - getDismissOnScrollProps(): handlers you can spread onto FlatList/ScrollView to auto-close the menu on scroll
 */
export function useAnchoredMenu() {
  const ctx = useContext(AnchoredMenuContext);
  if (!ctx) throw new Error("AnchoredMenuProvider is missing");

  const closeIfOpen = useCallback(() => {
    if (ctx.request) ctx.close();
  }, [ctx.request, ctx.close]);

  const getDismissOnScrollProps = useCallback(
    (opts = {}) => {
      const enabled = opts.enabled !== false;
      if (!enabled) return {};
      return {
        onScrollBeginDrag: closeIfOpen,
        onMomentumScrollBegin: closeIfOpen,
        // some Android RN versions fire this more reliably for flings
        onScrollEndDrag: closeIfOpen,
      };
    },
    [closeIfOpen]
  );

  return useMemo(
    () => ({
      open: ctx.open,
      close: ctx.close,
      isOpen: !!ctx.request,
      getDismissOnScrollProps,
    }),
    [ctx.open, ctx.close, ctx.request, getDismissOnScrollProps]
  );
}
