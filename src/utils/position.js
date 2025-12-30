import { Dimensions, I18nManager } from "react-native";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/**
 * Computes menu top/left with optional flip + clamping.
 * If menuSize is unknown (0), it still places, but clamping/flip is limited.
 */
export function computeMenuPosition({
  anchor,
  menuSize,
  viewport,
  placement = "auto", // 'auto' | 'top' | 'bottom'
  offset = 8,
  margin = 8,
  align = "start", // 'start' | 'center' | 'end'
  rtlAware = true,
}) {
  const { width: SW, height: SH } = viewport ?? Dimensions.get("window");
  const mW = menuSize?.width || 0;
  const mH = menuSize?.height || 0;

  // X alignment
  let left = anchor.pageX;
  if (align === "center" && mW) left = anchor.pageX + anchor.width / 2 - mW / 2;
  if (align === "end" && mW) left = anchor.pageX + anchor.width - mW;

  // RTL-aware alignment: flip start/end when RTL is enabled
  if (rtlAware && I18nManager.isRTL) {
    // In RTL, "start" means right side, "end" means left side
    if (align === "start" && mW) {
      // Align to right edge of anchor
      left = anchor.pageX + anchor.width - mW;
    } else if (align === "end" && mW) {
      // Align to left edge of anchor
      left = anchor.pageX;
    }
    // "center" stays the same in RTL
  }

  if (mW) left = clamp(left, margin, SW - mW - margin);
  else left = Math.max(margin, left);

  // Candidate vertical positions
  const belowTop = anchor.pageY + anchor.height + offset;
  const aboveTop = anchor.pageY - mH - offset;

  // Fit checks (meaningful when menu height is known)
  const fitsAbove = mH ? aboveTop >= margin : true;
  const fitsBelow = mH ? belowTop + mH <= SH - margin : true;

  let top;

  // Placement policy:
  // - "top": prefer above, fallback below if it doesn't fit
  // - "bottom": prefer below, fallback above if it doesn't fit
  // - "auto": prefer below if it fits, else above
  if (placement === "top") {
    top = fitsAbove ? aboveTop : belowTop;
  } else if (placement === "bottom") {
    top = fitsBelow ? belowTop : aboveTop;
  } else {
    top = fitsBelow ? belowTop : aboveTop;
  }

  // Final clamp
  if (mH) top = clamp(top, margin, SH - mH - margin);
  else top = Math.max(margin, top);

  return { top, left };
}
