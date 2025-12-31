import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Modal, Platform, Pressable, View } from "react-native";
import {
  AnchoredMenuActionsContext,
  AnchoredMenuStateContext,
} from "../core/context";
import { useAnchoredMenuState } from "../hooks/useAnchoredMenuState";
import {
  applyAnchorMargins,
  measureInWindowFast,
  measureInWindowStable,
} from "../utils/measure";
import { computeMenuPosition } from "../utils/position";
import { isFabricEnabled } from "../utils/runtime";
import type {
  AnchorMeasurement,
  MenuSize,
  Viewport,
} from "../types";

interface MeasureCache {
  t: number;
  anchorWin: AnchorMeasurement | null;
  hostWin: AnchorMeasurement | null;
}

export function ModalHost() {
  const actions = useContext(AnchoredMenuActionsContext);
  const store = useContext(AnchoredMenuStateContext);
  if (!actions || !store) throw new Error("AnchoredMenuProvider is missing");

  const activeHost = useAnchoredMenuState((s) => s.activeHost);
  if (activeHost !== "modal") return null;
  if (isFabricEnabled() && Platform.OS !== "web") return null;

  const req = useAnchoredMenuState((s) => s.request);
  const visible = !!req;

  const hostRef = useRef<View>(null);
  const [hostSize, setHostSize] = useState<MenuSize>({ width: 0, height: 0 });

  const [anchorWin, setAnchorWin] = useState<AnchorMeasurement | null>(null);
  const [hostWin, setHostWin] = useState<AnchorMeasurement | null>(null);
  const [menuSize, setMenuSize] = useState<MenuSize>({ width: 0, height: 0 });
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const measureCacheRef = useRef(new Map<string, MeasureCache>());
  const remeasureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Warm start: if we recently measured this anchor, seed state so the menu can appear faster.
    const cached = measureCacheRef.current.get(req.id);
    if (cached && Date.now() - cached.t < 300) {
      setAnchorWin(cached.anchorWin);
      setHostWin(cached.hostWin);
    }
  }, [req?.id, req]);

  // Measure after Modal is visible (hostRef exists only then)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!req) return;
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));

      const refObj = actions.anchors.get(req.id); // ref object
      if (!refObj || !hostRef.current) return;

      const strategy = req?.measurement ?? "stable";
      const tries =
        typeof req?.measurementTries === "number" ? req.measurementTries : 8;
      const measure =
        strategy === "fast" ? measureInWindowFast : measureInWindowStable;

      const [a, h] = await Promise.all([
        measure(refObj, strategy === "stable" ? { tries } : undefined),
        measure(hostRef, strategy === "stable" ? { tries } : undefined),
      ]);

      if (cancelled) return;
      const nextAnchorWin = applyAnchorMargins(a, refObj);
      setAnchorWin(nextAnchorWin);
      setHostWin(h);
      measureCacheRef.current.set(req.id, {
        t: Date.now(),
        anchorWin: nextAnchorWin,
        hostWin: h,
      });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [req?.id, req, actions.anchors]);

  // Re-measure when keyboard shows/hides
  useEffect(() => {
    if (!req) return;

    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // Debounce re-measurement to avoid multiple rapid calls
      if (remeasureTimeoutRef.current) {
        clearTimeout(remeasureTimeoutRef.current);
      }
      remeasureTimeoutRef.current = setTimeout(async () => {
        if (!req || !hostRef.current) return;
        const refObj = actions.anchors.get(req.id);
        if (!refObj) return;

        const strategy = req?.measurement ?? "stable";
        const tries =
          typeof req?.measurementTries === "number" ? req.measurementTries : 8;
        const measure =
          strategy === "fast" ? measureInWindowFast : measureInWindowStable;

        const [a, h] = await Promise.all([
          measure(refObj, strategy === "stable" ? { tries } : undefined),
          measure(hostRef, strategy === "stable" ? { tries } : undefined),
        ]);

        const nextAnchorWin = applyAnchorMargins(a, refObj);
        setAnchorWin(nextAnchorWin);
        setHostWin(h);
        measureCacheRef.current.set(req.id, {
          t: Date.now(),
          anchorWin: nextAnchorWin,
          hostWin: h,
        });
      }, 100);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      // Re-measure when keyboard hides
      if (remeasureTimeoutRef.current) {
        clearTimeout(remeasureTimeoutRef.current);
      }
      remeasureTimeoutRef.current = setTimeout(async () => {
        if (!req || !hostRef.current) return;
        const refObj = actions.anchors.get(req.id);
        if (!refObj) return;

        const strategy = req?.measurement ?? "stable";
        const tries =
          typeof req?.measurementTries === "number" ? req.measurementTries : 8;
        const measure =
          strategy === "fast" ? measureInWindowFast : measureInWindowStable;

        const [a, h] = await Promise.all([
          measure(refObj, strategy === "stable" ? { tries } : undefined),
          measure(hostRef, strategy === "stable" ? { tries } : undefined),
        ]);

        const nextAnchorWin = applyAnchorMargins(a, refObj);
        setAnchorWin(nextAnchorWin);
        setHostWin(h);
        measureCacheRef.current.set(req.id, {
          t: Date.now(),
          anchorWin: nextAnchorWin,
          hostWin: h,
        });
      }, 100);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      if (remeasureTimeoutRef.current) {
        clearTimeout(remeasureTimeoutRef.current);
      }
    };
  }, [req?.id, req, actions.anchors]);

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
    const viewport: Viewport | undefined =
      hostSize.width && hostSize.height
        ? {
            width: hostSize.width,
            height: hostSize.height - keyboardHeight, // Adjust viewport for keyboard
          }
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
  }, [req, anchorInHost, menuSize, hostSize, keyboardHeight]);

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
      onRequestClose={actions.close}
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
        <Pressable style={{ flex: 1 }} onPress={actions.close}>
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
                    close: actions.close,
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

