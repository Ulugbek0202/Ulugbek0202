import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Button.
 *
 * The visual language is architectural: square corners, a drawn border, and a
 * fill that wipes in from the bottom rather than fading. Motion is a background
 * layer that translates on hover, which keeps it off the compositor's layout
 * path and stays smooth on low-end devices.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden ' +
  'font-sans font-medium tracking-[0.01em] whitespace-nowrap ' +
  'transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'disabled:pointer-events-none disabled:opacity-45';

const variants: Record<ButtonVariant, string> = {
  // Bronze fill on charcoal. The most prominent action on a light surface.
  primary: 'bg-ink text-bone hover:text-ink',
  // Outlined, for secondary actions beside a primary.
  secondary: 'border border-ink/25 text-ink hover:text-bone',
  // Text-only, with a rule that draws in on hover.
  ghost: 'text-ink hover:text-bronze px-0',
  // For use on charcoal sections.
  inverse: 'bg-bone text-ink hover:text-bone',
  outline: 'border border-bone/30 text-bone hover:text-ink',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-5 text-[0.8125rem]',
  md: 'h-12 px-7 text-[0.875rem]',
  lg: 'h-14 px-9 text-[0.9375rem]',
};

/** Fill colour that wipes in behind the label on hover. */
const fill: Record<ButtonVariant, string> = {
  primary: 'bg-bronze',
  secondary: 'bg-ink',
  ghost: '',
  inverse: 'bg-bronze',
  outline: 'bg-bone',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Rendered after the label, typically an arrow icon. */
  trailing?: ReactNode;
  /** Rendered before the label. */
  leading?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    trailing,
    leading,
    fullWidth,
    className,
    children,
    ...props
  },
  ref,
) {
  const isGhost = variant === 'ghost';

  return (
    <button
      ref={ref}
      className={cn(
        base,
        variants[variant],
        isGhost ? 'h-auto py-1' : sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {!isGhost && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-0 -z-0 translate-y-full',
            'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'group-hover:translate-y-0 group-focus-visible:translate-y-0',
            fill[variant],
          )}
        />
      )}

      {isGhost && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current',
            'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'group-hover:scale-x-100 group-focus-visible:scale-x-100',
          )}
        />
      )}

      <span className="relative z-10 inline-flex items-center gap-3">
        {leading && (
          <span className="transition-transform duration-500 group-hover:-translate-x-0.5">
            {leading}
          </span>
        )}
        {children}
        {trailing && (
          <span className="transition-transform duration-500 group-hover:translate-x-1">
            {trailing}
          </span>
        )}
      </span>
    </button>
  );
});
