import type { ProviderEntry } from "../types";

const providers: ProviderEntry[] = []; // stack order by mount time

export function registerProvider(entry: ProviderEntry): () => void {
  providers.push(entry);
  return () => unregisterProvider(entry);
}

export function unregisterProvider(entry: ProviderEntry): void {
  const idx = providers.indexOf(entry);
  if (idx >= 0) providers.splice(idx, 1);
}

export function findProviderForAnchorId(anchorId: string | null | undefined): ProviderEntry | null {
  if (!anchorId) return null;

  // Prefer most recently mounted provider that has the anchor id.
  for (let i = providers.length - 1; i >= 0; i--) {
    const p = providers[i];
    try {
      if (p?.anchors?.has(anchorId)) return p;
    } catch {
      // ignore
    }
  }
  return null;
}

export function findAllProvidersForAnchorId(
  anchorId: string | null | undefined
): ProviderEntry[] {
  const matches: ProviderEntry[] = [];
  if (!anchorId) return matches;
  for (let i = 0; i < providers.length; i++) {
    const p = providers[i];
    try {
      if (p?.anchors?.has(anchorId)) matches.push(p);
    } catch {
      // ignore
    }
  }
  return matches;
}

