export { AnchoredMenuProvider } from "./core/provider";
export { MenuAnchor } from "./components/MenuAnchor";
export { AnchoredMenuLayer } from "./components/AnchoredMenuLayer";
export { AnchoredMenuScope } from "./components/AnchoredMenuScope";
export { useAnchoredMenu } from "./hooks/useAnchoredMenu";

export { ModalHost } from "./hosts/ModalHost";
export { ViewHost } from "./hosts/ViewHost";

// RNN optional host + overlay screen + registry
export { RNNHost, registerRNNMenu, unregisterRNNMenu } from "./hosts/RNNHost";
export { RNNOverlayScreen } from "./hosts/RNNOverlayScreen";

// Backwards-compat / convenience: allow default import
//   import AnchoredMenuProvider from 'react-native-anchored-menu'
export { AnchoredMenuProvider as default } from "./core/provider";
