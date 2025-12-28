import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform } from "react-native";
import {
  AnchoredMenuActionsContext,
  AnchoredMenuStateContext,
} from "./context";
import { ModalHost } from "../hosts/ModalHost";
import { ViewHost } from "../hosts/ViewHost";
import { isFabricEnabled } from "../utils/runtime";
import {
  findAllProvidersForAnchorId,
  findProviderForAnchorId,
  registerProvider,
} from "./providerRegistry";

/**
 * Provider config
 * - defaultHost: which host to use when `open()` doesn't specify one (default: "view")
 * - autoHost: automatically mounts the host implementation (default: true)
 *
 * request shape (open payload)
 * Modal/View host:
 *  {
 *    id,
 *    host?: "modal" | "view",
 *    placement?, offset?, margin?, align?, rtlAware?,
 *    animationType?,
 *    statusBarTranslucent?, // Android-only, for modal host
 *    render?: fn,
 *    content?: node
 *  }
 */
export function AnchoredMenuProvider({
  children,
  // backwards compatible alias
  host,
  defaultHost = host ?? "view",
  autoHost = true,
}) {
  const anchorsRef = useRef(new Map()); // id -> ref
  const pendingOpenRafRef = useRef(null);
  const defaultHostRef = useRef(defaultHost);
  defaultHostRef.current = defaultHost;

  // Tiny external store so open/close doesn't re-render the whole provider subtree.
  const storeRef = useRef(null);
  if (!storeRef.current) {
    const listeners = new Set();
    let snapshot = { request: null, activeHost: defaultHost, isOpen: false };
    storeRef.current = {
      getSnapshot: () => snapshot,
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      _setSnapshot: (next) => {
        snapshot = next;
        listeners.forEach((l) => l());
      },
    };
  }

  const setRequest = useCallback((payload) => {
    const defaultH = defaultHostRef.current ?? "view";
    let nextActiveHost = payload?.host ?? defaultH;

    // Guard: unknown host -> view
    if (nextActiveHost !== "view" && nextActiveHost !== "modal") {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          `[react-native-anchored-menu] Unknown host="${String(
            nextActiveHost
          )}". Falling back to host="view".`
        );
      }
      nextActiveHost = "view";
    }

    // Defensive: ModalHost can trigger internal React/Fabric issues in some environments.
    if (
      nextActiveHost === "modal" &&
      isFabricEnabled() &&
      Platform.OS !== "web"
    ) {
      nextActiveHost = "view";
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          '[react-native-anchored-menu] host="modal" is disabled when Fabric is enabled; falling back to host="view".'
        );
      }
    }

    storeRef.current._setSnapshot({
      request: payload ?? null,
      activeHost: payload ? nextActiveHost : defaultH,
      isOpen: !!payload,
    });
  }, []);

  const registerAnchor = useCallback((id, ref) => {
    anchorsRef.current.set(id, ref);
  }, []);

  const unregisterAnchor = useCallback((id) => {
    anchorsRef.current.delete(id);
  }, []);

  // Register this provider globally so parents can route `open({ id })` to the correct layer.
  useEffect(() => {
    const entry = { anchors: anchorsRef.current, setRequest };
    return registerProvider(entry);
  }, []);

  const open = useCallback((payload) => {
    // Defer by default to avoid "open tap" being interpreted as an outside press
    // when a host mounts a Pressable backdrop during the active gesture.
    if (pendingOpenRafRef.current) {
      cancelAnimationFrame(pendingOpenRafRef.current);
      pendingOpenRafRef.current = null;
    }

    const commit = () => {
      if (!payload) return setRequest(null);

      // If the anchor isn't registered in this provider, route to a nested provider that has it.
      const anchorId = payload.id;
      const hasLocalAnchor = anchorsRef.current?.has?.(anchorId);

      if (!hasLocalAnchor) {
        const matches = findAllProvidersForAnchorId(anchorId);
        if (matches.length > 1) {
          // eslint-disable-next-line no-console
          console.warn(
            `[react-native-anchored-menu] Multiple MenuAnchors registered with id="${anchorId}". ` +
              "Using the most recently mounted provider. Consider unique ids per screen/modal."
          );
        }
        const target = findProviderForAnchorId(anchorId);
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
  }, []);

  const close = useCallback(() => {
    if (pendingOpenRafRef.current) {
      cancelAnimationFrame(pendingOpenRafRef.current);
      pendingOpenRafRef.current = null;
    }
    setRequest(null);
  }, []);

  const actionsValue = useMemo(
    () => ({
      anchors: anchorsRef.current,
      registerAnchor,
      unregisterAnchor,
      open,
      close,
      // provider config
      defaultHost,
    }),
    [registerAnchor, unregisterAnchor, open, close, defaultHost]
  );

  const stateStore = storeRef.current;

  return (
    <AnchoredMenuActionsContext.Provider value={actionsValue}>
      <AnchoredMenuStateContext.Provider value={stateStore}>
        {children}
        {autoHost ? (
          <>
            <ModalHost />
            <ViewHost />
          </>
        ) : null}
      </AnchoredMenuStateContext.Provider>
    </AnchoredMenuActionsContext.Provider>
  );
}
