import { InteractionManager, UIManager, findNodeHandle } from "react-native";
import type { AnchorMeasurement, AnchorRefObject } from "../types";

const raf = (): Promise<number> => new Promise((r) => requestAnimationFrame(r));

async function measureInWindowOnce(
  target: { current: number | null } | number | null
): Promise<AnchorMeasurement | null> {
  const node = findNodeHandle(
    (target as { current?: number | null })?.current ?? target
  );
  if (!node) return null;
  return await new Promise<AnchorMeasurement>((resolve) => {
    // UIManager.measureInWindow callback signature varies by RN version
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (UIManager.measureInWindow as any)(node, (x: number, y: number, width: number, height: number) => {
      resolve({ pageX: x, pageY: y, width, height });
    });
  });
}

/**
 * Faster (less stable) measurement: one RAF + single measureInWindow call.
 * Useful for very simple layouts where Android/FlatList flakiness isn't a concern.
 */
export async function measureInWindowFast(
  target: { current: number | null } | number | null
): Promise<AnchorMeasurement | null> {
  await raf();
  return await measureInWindowOnce(target);
}

export interface MeasureOptions {
  tries?: number;
}

/**
 * More reliable measurement for Android/FlatList: waits for interactions + next frame(s)
 * and retries until values stabilize.
 */
export async function measureInWindowStable(
  target: { current: number | null } | number | null,
  { tries = 8 }: MeasureOptions = {}
): Promise<AnchorMeasurement | null> {
  await new Promise((r) => InteractionManager.runAfterInteractions(r));

  const node = findNodeHandle(
    (target as { current?: number | null })?.current ?? target
  );
  if (!node) return null;

  let last: AnchorMeasurement | null = null;

  for (let i = 0; i < tries; i++) {
    await raf();

    const m = await measureInWindowOnce({ current: node });

    if (!m) continue;

    const looksInvalid = m.pageX === 0 && m.pageY === 0 && i < tries - 1;
    const stable =
      last &&
      Math.abs(m.pageX - last.pageX) < 1 &&
      Math.abs(m.pageY - last.pageY) < 1;

    if (!looksInvalid && (stable || i >= 1)) return m;

    last = m;
  }

  return last;
}

/**
 * FlatList-safe: waits for interactions and next frame before measuring.
 * Uses measureInWindow so coords match overlay/Modal window coordinates.
 */
export async function measureAnchorInWindow(
  ref: { current: number | null } | number | null
): Promise<AnchorMeasurement | null> {
  return await measureInWindowStable(ref, { tries: 8 });
}

/**
 * Adjust measured rect to ignore margins applied on the anchored child.
 * `MenuAnchor` stores margins on the ref object as `__anchoredMenuMargins`.
 */
export function applyAnchorMargins(
  measured: AnchorMeasurement | null,
  refObj: AnchorRefObject | null
): AnchorMeasurement | null {
  if (!measured) return measured;
  const m = refObj?.__anchoredMenuMargins;
  if (!m) return measured;

  const top = typeof m.top === "number" ? m.top : 0;
  const bottom = typeof m.bottom === "number" ? m.bottom : 0;
  const left = typeof m.left === "number" ? m.left : 0;
  const right = typeof m.right === "number" ? m.right : 0;

  const width = Math.max(0, measured.width - left - right);
  const height = Math.max(0, measured.height - top - bottom);

  return {
    ...measured,
    pageX: measured.pageX + left,
    pageY: measured.pageY + top,
    width,
    height,
  };
}

