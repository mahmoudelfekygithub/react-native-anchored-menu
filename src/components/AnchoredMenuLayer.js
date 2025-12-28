import React from "react";
import { View } from "react-native";
import { AnchoredMenuProvider } from "../core/provider";

/**
 * AnchoredMenuLayer
 *
 * A convenience wrapper that ensures the "view" host has a stable layout box to fill.
 * Use it at app root and inside RN <Modal> (wrap the full-screen modal container).
 */
export function AnchoredMenuLayer({
  children,
  style,
  defaultHost = "view",
  ...providerProps
}) {
  return (
    <View style={[{ flex: 1, position: "relative" }, style]}>
      <AnchoredMenuProvider defaultHost={defaultHost} {...providerProps}>
        {children}
      </AnchoredMenuProvider>
    </View>
  );
}


