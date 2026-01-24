import React, { useContext, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { AnchoredMenuActionsContext } from "../core/context";
import type { AnchorMargins, AnchorRefObject, MenuAnchorProps } from "../types";

function extractMarginsFromChild(children: React.ReactNode): AnchorMargins {
  try {
    const child = React.Children.only(children) as React.ReactElement;
    const flat = StyleSheet.flatten(child?.props?.style) || {};
    const mv =
      typeof flat.marginVertical === "number" ? flat.marginVertical : undefined;
    const mh =
      typeof flat.marginHorizontal === "number"
        ? flat.marginHorizontal
        : undefined;
    const m = typeof flat.margin === "number" ? flat.margin : 0;

    const top = (typeof flat.marginTop === "number" ? flat.marginTop : mv) ?? m;
    const bottom =
      (typeof flat.marginBottom === "number" ? flat.marginBottom : mv) ?? m;
    const left =
      (typeof flat.marginLeft === "number" ? flat.marginLeft : mh) ?? m;
    const right =
      (typeof flat.marginRight === "number" ? flat.marginRight : mh) ?? m;

    return { top, bottom, left, right };
  } catch {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
}

export function MenuAnchor({ id, children, style }: MenuAnchorProps) {
  const actions = useContext(AnchoredMenuActionsContext);
  if (!actions) {
    throw new Error(
      "[react-native-anchored-menu] MenuAnchor must be used within an AnchoredMenuProvider. " +
        "Make sure to wrap your component tree with <AnchoredMenuProvider>."
    );
  }

  const ref = useRef<View>(null) as AnchorRefObject;

  useEffect(() => {
    // Store child margins on the ref object so measurement can exclude margins.
    // This avoids offset differences when the anchored child uses e.g. marginBottom.
    ref.__anchoredMenuMargins = extractMarginsFromChild(children);

    actions.registerAnchor(id, ref);

    return () => {
      actions.unregisterAnchor(id);
    };
  }, [actions, id, children]);

  // collapsable={false} is important for Android measurement reliability
  return (
    <View ref={ref} collapsable={false} style={style}>
      {children}
    </View>
  );
}

