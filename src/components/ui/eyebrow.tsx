import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * Small uppercase label that opens a section. Optionally prefixed with a short
 * bronze rule, which is the site's most repeated editorial device.
 */
export function Eyebrow({
  children,
  rule = true,
  className,
  tone = 'dark',
}: {
  children: ReactNode;
  rule?: boolean;
  className?: string;
  tone?: 'dark' | 'light' | 'bronze';
}) {
  return (
    <p
      className={cn(
        'eyebrow flex items-center gap-3',
        tone === 'dark' && 'text-steel-deep',
        tone === 'light' && 'text-bone/60',
        tone === 'bronze' && 'text-bronze',
        className,
      )}
    >
      {rule && (
        <span
          aria-hidden="true"
          className={cn(
            'block h-px w-8 shrink-0',
            tone === 'light' ? 'bg-bone/40' : 'bg-bronze',
          )}
        />
      )}
      {children}
    </p>
  );
}

/**
 * Numbered section marker, used where a section is part of a sequence. Renders
 * as a monospaced figure so digits align across a page.
 */
export function SectionIndex({ index, className }: { index: number; className?: string }) {
  return (
    <span
      className={cn(
        'font-mono text-[0.6875rem] tabular-nums tracking-[0.18em] text-bronze',
        className,
      )}
      aria-hidden="true"
    >
      {String(index).padStart(2, '0')}
    </span>
  );
}
