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

  // Optional RTL: keep behavior stable by default, but you can tweak later.
  if (rtlAware && I18nManager.isRTL) {
    // no-op by default; some libraries map 'start'/'end' here.
  }

  if (mW) left = clamp(left, margin, SW - mW - margin);
  else left = Math.max(margin, left);

  // Default below
  let top = anchor.pageY + anchor.height + offset;

  const overflowBottom = mH && top + mH > SH - margin;
  const wantsTop =
    placement === "top" || (placement === "auto" && overflowBottom);

  if (wantsTop) {
    top = anchor.pageY - mH - offset;
    if (mH) top = clamp(top, margin, SH - mH - margin);
    else top = Math.max(margin, top);
  } else {
    if (mH) top = clamp(top, margin, SH - mH - margin);
    else top = Math.max(margin, top);
  }

  return { top, left };
}
