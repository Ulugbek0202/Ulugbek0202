import manifest from '@/data/image-manifest.json';

/**
 * Typed access to the downloaded photography.
 *
 * `scripts/fetch-images.mjs` writes `src/data/image-manifest.json` after
 * verifying each file on disk, so every path returned here resolves to a real
 * asset. Slots that failed to download are simply absent from the manifest and
 * resolve to `null`, letting components render a hatched placeholder frame
 * rather than a broken image.
 */
export type ImageSlot = keyof typeof manifest;

const registry = manifest as Record<string, string>;

/** Returns the public path for a slot, or `null` when the asset is missing. */
export function image(slot: ImageSlot | string): string | null {
  return registry[slot] ?? null;
}

/** Returns the public path for a slot, or a fallback path when missing. */
export function imageOr(slot: ImageSlot | string, fallback: string): string {
  return registry[slot] ?? fallback;
}

/** True when the slot resolved to a downloaded file. */
export function hasImage(slot: ImageSlot | string): boolean {
  return Boolean(registry[slot]);
}

/** Every slot that resolved, for preloading and gallery construction. */
export function allImages(): Record<string, string> {
  return { ...registry };
}

/**
 * Cycles through gallery slots, so a project with more images than the shared
 * pool wraps around predictably instead of repeating the first frame.
 */
export function gallerySlots(count: number, offset = 0): string[] {
  const slots = Object.keys(registry)
    .filter((key) => key.startsWith('gallery-'))
    .sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));

  if (slots.length === 0) return [];

  return Array.from({ length: count }, (_, index) => slots[(index + offset) % slots.length]);
}
