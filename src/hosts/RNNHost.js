import React, { useContext, useEffect, useRef } from "react";
import { AnchoredMenuContext } from "../core/context";
import { applyAnchorMargins, measureAnchorInWindow } from "../utils/measure";

const registry = {}; // menuKey -> (params) => ReactNode

export function registerRNNMenu(menuKey, renderFn) {
  registry[menuKey] = renderFn;
}

export function unregisterRNNMenu(menuKey) {
  delete registry[menuKey];
}

export function __getRegistry() {
  return registry;
}

export function RNNHost() {
  const ctx = useContext(AnchoredMenuContext);
  if (!ctx) throw new Error("AnchoredMenuProvider is missing");

  const activeHost = ctx.activeHost ?? ctx.host ?? "modal";
  const req = ctx.request;
  const overlayIdRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function dismissCurrent() {
      if (!overlayIdRef.current) return;
      const id = overlayIdRef.current;
      overlayIdRef.current = null;
      try {
        await ctx.Navigation.dismissOverlay(id);
      } catch {}
    }

    async function run() {
      // If we are leaving the RNN host (or default host is not rnn),
      // ensure any previously shown overlay is dismissed.
      if (activeHost !== "rnn") {
        await dismissCurrent();
        return;
      }

      if (!ctx.Navigation) {
        throw new Error(
          'host="rnn" requires Navigation from react-native-navigation'
        );
      }

      if (!req) {
        await dismissCurrent();
        return;
      }

      // RNN host is data-driven, not render-prop
      if (!req.menuKey) {
        throw new Error("RNN host requires open({ id, menuKey, data })");
      }

      const refObj = ctx.anchors.get(req.id);
      const ref = refObj?.current;
      if (!ref) return;

      const anchor = applyAnchorMargins(
        await measureAnchorInWindow(ref),
        refObj
      );
      if (cancelled || !anchor) return;

      await dismissCurrent();

      const overlayId = `AnchoredMenu_${req.id}_${Date.now()}`;
      overlayIdRef.current = overlayId;

      ctx.Navigation.showOverlay({
        component: {
          id: overlayId,
          name: ctx.rnnOverlayName ?? "AnchoredMenuOverlay",
          passProps: {
            overlayId,
            closeRequest: ctx.close,
            anchor,
            placement: req.placement ?? "auto",
            offset: req.offset ?? 8,
            margin: req.margin ?? 8,
            align: req.align ?? "start",
            rtlAware: req.rtlAware ?? true,
            menuKey: req.menuKey,
            data: req.data,
          },
          options: {
            overlay: { interceptTouchOutside: true },
            layout: { backgroundColor: "transparent" },
          },
        },
      });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [ctx, req]);

  return null;
}
