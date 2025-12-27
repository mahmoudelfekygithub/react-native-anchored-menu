import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions, Platform } from "react-native";
import { AnchoredMenuContext } from "./context";
import { ModalHost } from "../hosts/ModalHost";
import { ViewHost } from "../hosts/ViewHost";
import { RNNHost } from "../hosts/RNNHost";
import { RNNOverlayScreen } from "../hosts/RNNOverlayScreen";
import { isFabricEnabled } from "../utils/runtime";
import {
  findAllProvidersForAnchorId,
  findProviderForAnchorId,
  findProviderForScopeId,
  registerProvider,
} from "./providerRegistry";

let rnnOverlayRegistered = false;

/**
 * Provider config
 * - defaultHost: which host to use when `open()` doesn't specify one (default: "view")
 * - autoHost: automatically mounts the host implementation (default: true)
 * - autoRegisterRNNOverlay: automatically calls Navigation.registerComponent (default: true)
 * - rnnOverlayName: overlay component name used by RNNHost/showOverlay (default: "AnchoredMenuOverlay")
 *
 * request shape (open payload)
 * Modal/View host:
 *  {
 *    id,
 *    host?: "modal" | "view" | "rnn",
 *    placement?, offset?, margin?, align?, rtlAware?,
 *    animationType?,
 *    statusBarTranslucent?, // Android-only, for modal host
 *    render?: fn,
 *    content?: node
 *  }
 *
 * RNN host:
 *  { id, host?: "rnn", placement?, offset?, margin?, align?, rtlAware?, menuKey, data }
 */
export function AnchoredMenuProvider({
  children,
  // backwards compatible alias
  host,
  defaultHost = host ?? "view",
  autoHost = true,
  autoRegisterRNNOverlay = true,
  rnnOverlayName = "AnchoredMenuOverlay",
  scopeId = "root",
  Navigation,
  /** Auto-close the active menu when the window size changes (rotation, split-screen). */
  autoCloseOnWindowChange = true,
}) {
  const anchorsRef = useRef(new Map()); // id -> ref
  const [request, setRequest] = useState(null);
  const pendingOpenRafRef = useRef(null);

  const registerAnchor = useCallback((id, ref) => {
    anchorsRef.current.set(id, ref);
  }, []);

  const unregisterAnchor = useCallback((id) => {
    anchorsRef.current.delete(id);
  }, []);

  // Register this provider globally so parents can route `open({ id })` to the correct layer.
  useEffect(() => {
    const entry = { scopeId, anchors: anchorsRef.current, setRequest };
    return registerProvider(entry);
  }, [scopeId]);

  const open = useCallback((payload) => {
    // Defer by default to avoid "open tap" being interpreted as an outside press
    // when a host mounts a Pressable backdrop during the active gesture.
    if (pendingOpenRafRef.current) {
      cancelAnimationFrame(pendingOpenRafRef.current);
      pendingOpenRafRef.current = null;
    }

    const commit = () => {
      if (!payload) return setRequest(null);

// If a scopeId is provided and it doesn't match this provider, route directly.
// This enables deterministic layering (e.g. root vs modal) without relying on anchorId collisions.
if (payload?.scopeId && payload.scopeId !== scopeId) {
  const targetByScope = findProviderForScopeId(payload.scopeId);
  if (targetByScope?.setRequest) return targetByScope.setRequest(payload);
}

      // If the anchor isn't registered in this provider, route to a nested provider that has it.
      const anchorId = payload.id;
      const hasLocalAnchor = anchorsRef.current?.has?.(anchorId);

      if (!hasLocalAnchor) {
        const matches = findAllProvidersForAnchorId(anchorId, payload?.scopeId);
        if (matches.length > 1) {
          // eslint-disable-next-line no-console
          console.warn(
            `[react-native-anchored-menu] Multiple MenuAnchors registered with id="${anchorId}". ` +
              "Using the most recently mounted provider. Consider unique ids per screen/modal."
          );
        }
        const target = findProviderForAnchorId(anchorId, payload?.scopeId);
        if (target && target.setRequest) return target.setRequest(payload);
      }

      setRequest(payload);
    };

    if (payload?.immediate) commit();
    else {
      pendingOpenRafRef.current = requestAnimationFrame(() => {
        pendingOpenRafRef.current = null;
        commit();
      });
    }
  }, [scopeId]);

  const close = useCallback(() => {
    if (pendingOpenRafRef.current) {
      cancelAnimationFrame(pendingOpenRafRef.current);
      pendingOpenRafRef.current = null;
    }
    setRequest(null);
  }, []);


  // Auto-close on window size changes (rotation, split screen).
  useEffect(() => {
    if (!autoCloseOnWindowChange) return;

    const handler = () => {
      if (request) close();
    };

    // RN modern
    const sub = Dimensions.addEventListener?.("change", handler);

    // RN legacy fallback
    if (!sub && Dimensions.addEventListener) {
      Dimensions.addEventListener("change", handler);
    }

    return () => {
      if (sub && typeof sub.remove === "function") sub.remove();
      if (!sub && Dimensions.removeEventListener) {
        Dimensions.removeEventListener("change", handler);
      }
    };
  }, [autoCloseOnWindowChange, request, close]);
  let activeHost = request?.host ?? defaultHost;
  // Defensive: ModalHost can trigger internal React/Fabric issues in some environments.
  // Prefer stable `view` host when Fabric is enabled.
  if (activeHost === "modal" && isFabricEnabled() && Platform.OS !== "web") {
    activeHost = "view";
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(
        '[react-native-anchored-menu] host="modal" is disabled when Fabric is enabled; falling back to host="view".'
      );
    }
  }

  // Auto-register the overlay screen when Navigation is provided.
  // RNN requires registration before showing overlays.
  useEffect(() => {
    if (!autoRegisterRNNOverlay) return;
    if (!Navigation?.registerComponent) return;
    if (rnnOverlayRegistered) return;

    Navigation.registerComponent(rnnOverlayName, () => RNNOverlayScreen);
    rnnOverlayRegistered = true;
  }, [Navigation, autoRegisterRNNOverlay, rnnOverlayName]);

  const value = useMemo(
    () => ({
      anchors: anchorsRef.current,
      registerAnchor,
      unregisterAnchor,
      request,
      open,
      close,
      // provider config
      defaultHost,
      // resolved per-request host
      activeHost,
      Navigation,
      rnnOverlayName,
    }),
    [
      registerAnchor,
      unregisterAnchor,
      request,
      open,
      close,
      defaultHost,
      activeHost,
      Navigation,
      rnnOverlayName,
    ]
  );

  return (
    <AnchoredMenuContext.Provider value={value}>
      {children}
      {autoHost ? (
        activeHost === "modal" ? (
          <ModalHost />
        ) : activeHost === "rnn" ? (
          <RNNHost />
        ) : (
          <ViewHost />
        )
      ) : null}
    </AnchoredMenuContext.Provider>
  );
}
