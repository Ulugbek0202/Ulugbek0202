import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

/**
 * ============================================================================
 * MEDIA FRAME
 * ============================================================================
 * A single component for every photograph on the site.
 *
 * Why it exists: content is authored by non-developers through the admin panel,
 * so an image path can legitimately be missing or wrong. Rather than render a
 * broken `<img>` or a grey box, `MediaFrame` falls back to an architectural
 * hatched placeholder with an optional caption. That keeps the layout intact
 * and makes the gap obvious to whoever is editing the content.
 *
 * It also enforces the site's aspect ratios, so photography stays on grid
 * regardless of what the source file's dimensions happen to be.
 * ============================================================================
 */

export const aspectRatios = {
  /** Full-bleed hero. */
  cinematic: 'aspect-[16/9]',
  /** Wide editorial image. */
  wide: 'aspect-[3/2]',
  /** Standard landscape, the default for cards. */
  landscape: 'aspect-[4/3]',
  /** Square, used for partner tiles and portraits in tight grids. */
  square: 'aspect-square',
  /** Portrait, used for team members. */
  portrait: 'aspect-[3/4]',
  /** Tall crop for asymmetric editorial layouts. */
  tall: 'aspect-[2/3]',
} as const;

export type AspectRatio = keyof typeof aspectRatios;

interface MediaFrameProps {
  src: string | null | undefined;
  alt: string;
  ratio?: AspectRatio;
  className?: string;
  imageClassName?: string;
  /** Responsive `sizes` hint. Getting this right is the single biggest win for image payload. */
  sizes?: string;
  priority?: boolean;
  /** Optional caption rendered beneath the frame. */
  caption?: string;
  /** Overlay treatment for text laid over the image. */
  overlay?: 'none' | 'soft' | 'strong' | 'bottom';
  quality?: number;
  objectPosition?: string;
  /** Shown inside the placeholder when there is no image. */
  placeholderLabel?: string;
  fill?: boolean;
}

const overlays = {
  none: '',
  soft: 'bg-ink/25',
  strong: 'bg-ink/55',
  bottom: 'bg-gradient-to-t from-ink/85 via-ink/25 to-transparent',
} as const;

export function MediaFrame({
  src,
  alt,
  ratio = 'landscape',
  className,
  imageClassName,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  caption,
  overlay = 'none',
  quality = 82,
  objectPosition,
  placeholderLabel,
  fill = false,
}: MediaFrameProps) {
  const hasSource = typeof src === 'string' && src.trim().length > 0;

  return (
    <figure className={cn('group/media relative', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden bg-bone-deep',
          !fill && aspectRatios[ratio],
        )}
      >
        {hasSource ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={quality}
            className={cn(
              'object-cover',
              // A restrained zoom on hover: enough to feel alive, not enough to
              // distract. Disabled under reduced motion via the global rule.
              'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
              'group-hover/media:scale-[1.035]',
              imageClassName,
            )}
            style={objectPosition ? { objectPosition } : undefined}
          />
        ) : (
          <PlaceholderFrame label={placeholderLabel} />
        )}

        {overlay !== 'none' && (
          <div aria-hidden="true" className={cn('absolute inset-0', overlays[overlay])} />
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 text-caption text-steel-deep">{caption}</figcaption>
      )}
    </figure>
  );
}

/**
 * The fallback. Deliberately handsome: a hatched field with corner registration
 * marks, so a missing asset reads as an intentional technical drawing rather
 * than a bug.
 */
function PlaceholderFrame({ label }: { label?: string }) {
  return (
    <div className="hatch absolute inset-0 flex items-center justify-center bg-bone-deep">
      <div className="relative flex h-full w-full items-center justify-center">
        <CornerMarks />
        <span className="eyebrow relative z-10 bg-bone-deep/90 px-3 py-2 text-steel-deep">
          {label ?? 'Image pending'}
        </span>
      </div>
    </div>
  );
}

function CornerMarks() {
  const mark = 'absolute h-4 w-4 border-bronze/50';
  return (
    <span aria-hidden="true">
      <span className={cn(mark, 'left-3 top-3 border-l border-t')} />
      <span className={cn(mark, 'right-3 top-3 border-r border-t')} />
      <span className={cn(mark, 'bottom-3 left-3 border-b border-l')} />
      <span className={cn(mark, 'bottom-3 right-3 border-b border-r')} />
    </span>
  );
}

/**
 * Convenience wrapper for images that should fill a parent container that
 * already defines its own aspect ratio.
 */
export function MediaFill({
  src,
  alt,
  sizes = '100vw',
  priority,
  className,
  imageClassName,
  quality = 82,
  objectPosition,
  placeholderLabel,
}: Omit<MediaFrameProps, 'ratio' | 'fill'>) {
  return (
    <MediaFrame
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      className={cn('h-full w-full', className)}
      imageClassName={imageClassName}
      quality={quality}
      objectPosition={objectPosition}
      placeholderLabel={placeholderLabel}
      fill
    />
  );
}

export type { ImageProps };
