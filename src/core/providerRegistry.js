/**
 * Minimal global provider registry.
 *
 * Purpose: allow `open({ id })` called from a parent provider to route to a nested provider
 * that owns the requested anchor id (e.g. inside RN <Modal>).
 *
 * This avoids requiring consumers to call `useAnchoredMenu()` inside the nested subtree.
 */

const providers = []; // stack order by mount time

export function registerProvider(entry) {
  providers.push(entry);
  return () => unregisterProvider(entry);
}

export function unregisterProvider(entry) {
  const idx = providers.indexOf(entry);
  if (idx >= 0) providers.splice(idx, 1);
}

export function findProviderForAnchorId(anchorId) {
  if (!anchorId) return null;

  // Prefer most recently mounted provider that has the anchor id.
  for (let i = providers.length - 1; i >= 0; i--) {
    const p = providers[i];
    try {
      if (p?.anchors?.has(anchorId)) return p;
    } catch {}
  }
  return null;
}

export function findAllProvidersForAnchorId(anchorId) {
  const matches = [];
  if (!anchorId) return matches;
  for (let i = 0; i < providers.length; i++) {
    const p = providers[i];
    try {
      if (p?.anchors?.has(anchorId)) matches.push(p);
    } catch {}
  }
  return matches;
}


