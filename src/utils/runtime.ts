/**
 * Best-effort detection of Fabric/New Architecture.
 * Used only to avoid known-crashy code paths (e.g. nesting RN <Modal> in some setups).
 */
export function isFabricEnabled(): boolean {
  try {
    // In Fabric, nativeFabricUIManager is typically defined.
    // (Heuristic; varies by RN version)
    return !!(global as any)?.nativeFabricUIManager;
  } catch {
    return false;
  }
}

