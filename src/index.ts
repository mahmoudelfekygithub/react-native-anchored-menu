export { AnchoredMenuProvider } from "./core/provider";
export { MenuAnchor } from "./components/MenuAnchor";
export { AnchoredMenuLayer } from "./components/AnchoredMenuLayer";
export { useAnchoredMenu } from "./hooks/useAnchoredMenu";
export { useAnchoredMenuActions } from "./hooks/useAnchoredMenuActions";
export { useAnchoredMenuState } from "./hooks/useAnchoredMenuState";

export { ModalHost } from "./hosts/ModalHost";
export { ViewHost } from "./hosts/ViewHost";

// Backwards-compat / convenience: allow default import
//   import AnchoredMenuProvider from 'react-native-anchored-menu'
export { AnchoredMenuProvider as default } from "./core/provider";

// Export types
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
  MenuStore,
  AnchorRefObject,
  ProviderEntry,
  MenuActions,
  AnchoredMenuProviderProps,
  MenuAnchorProps,
  AnchoredMenuLayerProps,
  MenuPosition,
} from "./types";
export type { ComputeMenuPositionOptions } from "./utils/position";

