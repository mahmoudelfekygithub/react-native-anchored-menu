// Public, stable API
export { AnchoredMenuProvider } from "./core/provider";
export { MenuAnchor } from "./components/MenuAnchor";
export { AnchoredMenuLayer } from "./components/AnchoredMenuLayer";
export { useAnchoredMenu } from "./hooks/useAnchoredMenu";
export { useAnchoredMenuActions } from "./hooks/useAnchoredMenuActions";
export { useAnchoredMenuState } from "./hooks/useAnchoredMenuState";

// Backwards-compat / convenience: allow default import
//   import AnchoredMenuProvider from 'react-native-anchored-menu'
export { AnchoredMenuProvider as default } from "./core/provider";

// Types
export type {
  AnchorMeasurement,
  MenuSize,
  Viewport,
  AnchorMargins,
  Placement,
  Align,
  HostType,
  MeasurementStrategy,
  AnimationType,
  MenuRenderProps,
  MenuRenderFunction,
  OpenMenuOptions,
  MenuRequest,
  MenuState,
  AnchoredMenuProviderProps,
  MenuAnchorProps,
  AnchoredMenuLayerProps,
  MenuPosition,
} from "./types";
export type { ComputeMenuPositionOptions } from "./utils/position";

