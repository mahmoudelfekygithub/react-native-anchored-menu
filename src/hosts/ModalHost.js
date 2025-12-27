import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Platform, Pressable, View } from "react-native";
import { AnchoredMenuContext } from "../core/context";
import { applyAnchorMargins, measureInWindowStable } from "../utils/measure";
import { computeMenuPosition } from "../utils/position";
import { isFabricEnabled } from "../utils/runtime";

export function ModalHost() {
  const ctx = useContext(AnchoredMenuContext);
  if (!ctx) throw new Error("AnchoredMenuProvider is missing");

  const activeHost = ctx.activeHost ?? ctx.host ?? "modal";
  if (activeHost !== "modal") return null;
  if (isFabricEnabled() && Platform.OS !== "web") return null;

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

  // Measure after Modal is visible (hostRef exists only then)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!req) return;
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));

      const refObj = ctx.anchors.get(req.id); // ref object
      if (!refObj || !hostRef.current) return;

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

  // window coords -> host coords (avoids status bar / inset mismatches)
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

  const statusBarTranslucent =
    req?.statusBarTranslucent ?? (Platform.OS === "android" ? false : true);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={req.animationType ?? "fade"}
      statusBarTranslucent={statusBarTranslucent}
      onRequestClose={ctx.close}
    >
      <View
        ref={hostRef}
        collapsable={false}
        style={{ flex: 1 }}
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
    </Modal>
  );
}
