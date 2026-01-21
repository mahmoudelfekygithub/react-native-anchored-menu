import type { ReactNode, RefObject } from "react";
import type { ViewStyle } from "react-native";

/**
 * Anchor measurement result
 */
export interface AnchorMeasurement {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

/**
 * Menu size
 */
export interface MenuSize {
  width: number;
  height: number;
}

/**
 * Viewport dimensions
 */
export interface Viewport {
  width: number;
  height: number;
}

/**
 * Anchor margins (extracted from child style)
 */
export interface AnchorMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Menu placement options
 */
export type Placement = "auto" | "top" | "bottom";

/**
 * Menu alignment options
 */
export type Align = "start" | "center" | "end";

/**
 * Host type
 */
export type HostType = "view" | "modal";

/**
 * Measurement strategy
 */
export type MeasurementStrategy = "stable" | "fast";

/**
 * Animation type for modal
 */
export type AnimationType = "fade" | "none";

/**
 * Render function for menu content
 */
export interface MenuRenderProps {
  close: () => void;
  anchor: AnchorMeasurement | null;
  anchorInHost: AnchorMeasurement | null;
}

export type MenuRenderFunction = (props: MenuRenderProps) => ReactNode;

/**
 * Open menu request options
 */
export interface OpenMenuOptions {
  id: string;
  placement?: Placement;
  align?: Align;
  offset?: number;
  margin?: number;
  rtlAware?: boolean;
  render?: MenuRenderFunction;
  content?: ReactNode;
  host?: HostType;
  animationType?: AnimationType;
  statusBarTranslucent?: boolean;
  measurement?: MeasurementStrategy;
  measurementTries?: number;
  immediate?: boolean;
}

/**
 * Menu request (internal state)
 */
export interface MenuRequest extends OpenMenuOptions {
  id: string;
}

/**
 * Menu state snapshot
 */
export interface MenuState {
  request: MenuRequest | null;
  activeHost: HostType;
  isOpen: boolean;
}

/**
 * External store interface
 */
export interface MenuStore {
  getSnapshot: () => MenuState;
  subscribe: (listener: () => void) => () => void;
  _setSnapshot: (next: MenuState) => void;
}

/**
 * Anchor ref object (with custom properties)
 */
export interface AnchorRefObject extends RefObject<any> {
  __anchoredMenuMargins?: AnchorMargins;
}

/**
 * Provider entry in registry
 */
export interface ProviderEntry {
  anchors: Map<string, AnchorRefObject>;
  setRequest: (payload: MenuRequest | null) => void;
}

/**
 * Menu actions (stable context)
 */
export interface MenuActions {
  anchors: Map<string, AnchorRefObject>;
  registerAnchor: (id: string, ref: AnchorRefObject) => void;
  unregisterAnchor: (id: string) => void;
  open: (options: OpenMenuOptions) => void;
  close: () => void;
  defaultHost: HostType;
}

/**
 * AnchoredMenuProvider props
 */
export interface AnchoredMenuProviderProps {
  children: ReactNode;
  defaultHost?: HostType;
  autoHost?: boolean;
  /** Whether to automatically close menus when app goes to background/inactive (default: false) */
  autoCloseOnBackground?: boolean;
  host?: HostType;
}

/**
 * MenuAnchor props
 */
export interface MenuAnchorProps {
  id: string;
  children: ReactNode;
}

/**
 * AnchoredMenuLayer props
 */
export interface AnchoredMenuLayerProps extends Omit<AnchoredMenuProviderProps, "children"> {
  children: ReactNode;
  style?: ViewStyle;
}

/**
 * Position calculation result
 */
export interface MenuPosition {
  top: number;
  left: number;
}

