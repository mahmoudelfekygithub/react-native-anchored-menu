import React from "react";
import { AnchoredMenuLayer } from "./AnchoredMenuLayer";

/**
 * AnchoredMenuScope
 *
 * Creates an isolated anchored-menu scope (layer) with its own provider + auto-mounted host.
 * Use this inside RN <Modal> (or any nested layer) to ensure menus render above the correct window.
 *
 * Example:
 *   <Modal ...>
 *     <AnchoredMenuScope scopeId="modal-1">
 *       <ModalContent />
 *     </AnchoredMenuScope>
 *   </Modal>
 */
export function AnchoredMenuScope({ scopeId, children, ...props }) {
  return (
    <AnchoredMenuLayer scopeId={scopeId} {...props}>
      {children}
    </AnchoredMenuLayer>
  );
}
