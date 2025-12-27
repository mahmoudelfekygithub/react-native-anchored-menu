/**
 * Minimal global provider registry.
 *
 * Purpose:
 * - Route open({ id }) called from a parent provider to a nested provider that owns the anchor
 *   (e.g. inside RN <Modal> or nested tree).
 * - Additionally supports explicit scoping via `scopeId` so consumers can deterministically
 *   target a specific layer (root vs modal) without relying on anchorId collisions.
 */

const providers = []; // stack order by mount time (older -> newer)

export function registerProvider(entry) {
  providers.push(entry);
  return () => unregisterProvider(entry);
}

export function unregisterProvider(entry) {
  const idx = providers.indexOf(entry);
  if (idx >= 0) providers.splice(idx, 1);
}

export function findProviderForScopeId(scopeId) {
  if (!scopeId) return null;
  for (let i = providers.length - 1; i >= 0; i--) {
    const p = providers[i];
    if (p?.scopeId === scopeId) return p;
  }
  return null;
}

export function findProviderForAnchorId(anchorId, scopeId) {
  if (!anchorId) return null;

  // If scopeId is provided, prefer providers in that scope.
  if (scopeId) {
    for (let i = providers.length - 1; i >= 0; i--) {
      const p = providers[i];
      try {
        if (p?.scopeId === scopeId && p?.anchors?.has(anchorId)) return p;
      } catch {}
    }
  }

  // Fallback: prefer most recently mounted provider that has the anchor id.
  for (let i = providers.length - 1; i >= 0; i--) {
    const p = providers[i];
    try {
      if (p?.anchors?.has(anchorId)) return p;
    } catch {}
  }
  return null;
}

export function findAllProvidersForAnchorId(anchorId, scopeId) {
  const matches = [];
  if (!anchorId) return matches;

  for (let i = 0; i < providers.length; i++) {
    const p = providers[i];
    try {
      if (!p?.anchors?.has(anchorId)) continue;
      if (scopeId && p?.scopeId !== scopeId) continue;
      matches.push(p);
    } catch {}
  }
  return matches;
}
