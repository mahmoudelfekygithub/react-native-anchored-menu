import React, { useMemo, useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { computeMenuPosition } from "../utils/position";
import { __getRegistry } from "./RNNHost";

/**
 * RNN overlay screen.
 * Note: we avoid importing `react-native-navigation` here to keep it optional.
 * The overlay is dismissed via `closeRequest`, which causes `RNNHost` to dismiss it.
 */
export function RNNOverlayScreen({
  closeRequest,
  anchor,
  placement = "auto",
  offset = 8,
  margin = 8,
  align = "start",
  rtlAware = true,
  menuKey,
  data,
}) {
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });

  const renderFn = __getRegistry()?.[menuKey];

  const position = useMemo(() => {
    if (!anchor) return null;
    return computeMenuPosition({
      anchor,
      menuSize,
      viewport: Dimensions.get("window"),
      placement,
      offset,
      margin,
      align,
      rtlAware,
    });
  }, [anchor, menuSize, placement, offset, margin, align, rtlAware]);

  const needsInitialMeasure = menuSize.width === 0 || menuSize.height === 0;
  const visible = !!anchor && !!position && !!renderFn;
  if (!visible) return null;

  return (
    <Pressable style={{ flex: 1 }} onPress={closeRequest}>
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
        {renderFn({ close: closeRequest, anchor, data })}
      </View>
    </Pressable>
  );
}
