import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { AnchoredMenuContext } from "../core/context";
import { applyAnchorMargins, measureInWindowStable } from "../utils/measure";
import { computeMenuPosition } from "../utils/position";

/**
 * ViewHost (non-native-modal host)
 *
 * Renders the menu as an absolutely-positioned overlay View, without presenting
 * a native <Modal>. This is safe to use inside an existing RN <Modal>.
 *
 * NOTE: Must be mounted inside a parent that can cover the intended area
 * (usually at the app root, or inside your RN Modal content).
 */
export function ViewHost() {
  const ctx = useContext(AnchoredMenuContext);
  if (!ctx) throw new Error("AnchoredMenuProvider is missing");

  const activeHost = ctx.activeHost ?? ctx.host ?? "modal";
  if (activeHost !== "view") return null;

  const req = ctx.request;
  const visible = !!req;

  const hostRef = useRef(null);
  const [hostSize, setHostSize] = useState({ width: 0, height: 0 });

  const [anchorWin, setAnchorWin] = useState(null);
  const [hostWin, setHostWin] = useState(null);
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!req) {
      setAnchorWin(null);
      setHostWin(null);
      setMenuSize({ width: 0, height: 0 });
      return;
    }
    // reset on open / anchor change
    setAnchorWin(null);
    setHostWin(null);
    setMenuSize({ width: 0, height: 0 });
  }, [req?.id, req]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!req || !hostRef.current) return;
      await new Promise((r) => requestAnimationFrame(r));

      const refObj = ctx.anchors.get(req.id); // ref object
      if (!refObj) return;

      const [a, h] = await Promise.all([
        measureInWindowStable(refObj),
        measureInWindowStable(hostRef),
      ]);

      if (cancelled) return;
      setAnchorWin(applyAnchorMargins(a, refObj));
      setHostWin(h);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [req?.id, req, ctx.anchors]);

  const anchorInHost = useMemo(() => {
    if (!anchorWin || !hostWin) return null;
    return {
      ...anchorWin,
      pageX: anchorWin.pageX - hostWin.pageX,
      pageY: anchorWin.pageY - hostWin.pageY,
    };
  }, [anchorWin, hostWin]);

  const position = useMemo(() => {
    if (!req || !anchorInHost) return null;
    const viewport =
      hostSize.width && hostSize.height
        ? { width: hostSize.width, height: hostSize.height }
        : undefined;

    return computeMenuPosition({
      anchor: anchorInHost,
      menuSize,
      viewport,
      placement: req.placement ?? "auto",
      offset: req.offset ?? 8,
      margin: req.margin ?? 8,
      align: req.align ?? "start",
      rtlAware: req.rtlAware ?? true,
    });
  }, [req, anchorInHost, menuSize, hostSize]);

  const needsInitialMeasure = menuSize.width === 0 || menuSize.height === 0;
  if (!visible) return null;

  return (
    <View
      ref={hostRef}
      collapsable={false}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 9999,
        elevation: 9999,
      }}
      pointerEvents="box-none"
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (width !== hostSize.width || height !== hostSize.height) {
          setHostSize({ width, height });
        }
      }}
    >
      {/* Tap outside to dismiss */}
      <Pressable style={{ flex: 1 }} onPress={ctx.close}>
        {visible && !!anchorInHost && !!position ? (
          <View
            style={{
              position: "absolute",
              // Keep in-place so layout runs on iOS; hide visually until measured to avoid flicker.
              top: position.top,
              left: position.left,
              zIndex: 10000,
              elevation: 10000,
              opacity: needsInitialMeasure ? 0 : 1,
            }}
            pointerEvents={needsInitialMeasure ? "none" : "auto"}
            onStartShouldSetResponder={() => true}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              if (width !== menuSize.width || height !== menuSize.height) {
                setMenuSize({ width, height });
              }
            }}
          >
            {typeof req.render === "function"
              ? req.render({
                  close: ctx.close,
                  anchor: anchorWin,
                  anchorInHost,
                })
              : req.content}
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}
