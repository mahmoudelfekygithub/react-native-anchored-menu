import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AppState, Platform } from "react-native";
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
import type {
  AnchoredMenuProviderProps,
  HostType,
  MenuRequest,
  MenuState,
  MenuStore,
  OpenMenuOptions,
} from "../types";

/**
 * Provider config
 * - defaultHost: which host to use when `open()` doesn't specify one (default: "view")
 * - autoHost: automatically mounts the host implementation (default: true)
 * - autoCloseOnBackground: automatically close menus when app goes to background (default: false)
 */
export function AnchoredMenuProvider({
  children,
  // backwards compatible alias
  host,
  defaultHost = (host ?? "view") as HostType,
  autoHost = true,
  autoCloseOnBackground = false,
}: AnchoredMenuProviderProps) {
  const anchorsRef = useRef(new Map<string, any>()); // id -> ref
  const pendingOpenRafRef = useRef<number | null>(null);
  const defaultHostRef = useRef(defaultHost);
  defaultHostRef.current = defaultHost; //this is to update the defaultHostRef.current when the defaultHost prop changes

  // Tiny external store so open/close doesn't re-render the whole provider subtree.
  const storeRef = useRef<MenuStore | null>(null);
  if (!storeRef.current) {
    const listeners = new Set<() => void>();
    let snapshot: MenuState = {
      request: null,
      activeHost: defaultHost,
      isOpen: false,
    };
    storeRef.current = {
      getSnapshot: () => snapshot,
      subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      _setSnapshot: (next: MenuState) => {
        snapshot = next;
        listeners.forEach((l) => l());
      },
    };
  }

  const setRequest = useCallback((payload: MenuRequest | null) => {
    const defaultH = defaultHostRef.current ?? "view";
    let nextActiveHost: HostType = (payload?.host ?? defaultH) as HostType;

    // Guard: unknown host -> view
    if (nextActiveHost !== "view" && nextActiveHost !== "modal") {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(
          `[react-native-anchored-menu] Unknown host="${String(
            nextActiveHost,
          )}". Falling back to host="view".`,
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
          '[react-native-anchored-menu] host="modal" is disabled when Fabric is enabled; falling back to host="view".',
        );
      }
    }

    storeRef.current!._setSnapshot({
      request: payload ?? null,
      activeHost: payload ? nextActiveHost : defaultH,
      isOpen: !!payload,
    });
  }, []);

  const registerAnchor = useCallback((id: string, ref: any) => {
    anchorsRef.current.set(id, ref);
  }, []);

  const unregisterAnchor = useCallback((id: string) => {
    anchorsRef.current.delete(id);
  }, []);

  // Register this provider globally so parents can route `open({ id })` to the correct layer.
  useEffect(() => {
    const entry = { anchors: anchorsRef.current, setRequest };
    const unregister = registerProvider(entry);
    return () => {
      // Close menu if open when provider unmounts
      if (storeRef.current?.getSnapshot().isOpen) {
        setRequest(null);
      }
      unregister();
    };
  }, [setRequest]);

  // Auto-close menu when app goes to background to avoid weird states
  useEffect(() => {
    if (!autoCloseOnBackground) return;

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: string) => {
        if (nextAppState === "background" || nextAppState === "inactive") {
          if (storeRef.current?.getSnapshot().isOpen) {
            setRequest(null);
          }
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [setRequest, autoCloseOnBackground]);

  const open = useCallback((payload: OpenMenuOptions) => {
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
              "Using the most recently mounted provider. Consider unique ids per screen/modal.",
          );
        }
        const target = findProviderForAnchorId(anchorId);
        if (target && target.setRequest) {
          return target.setRequest(payload as MenuRequest);
        }
        // Anchor not found in any provider
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn(
            `[react-native-anchored-menu] Anchor with id="${anchorId}" not found in any provider. ` +
              "Make sure the MenuAnchor is mounted and the id matches.",
          );
        }
        return; // Don't open menu if anchor doesn't exist
      }

      setRequest(payload as MenuRequest);
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
    [registerAnchor, unregisterAnchor, open, close, defaultHost],
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
