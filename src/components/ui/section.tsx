import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Eyebrow, SectionIndex } from './eyebrow';

/**
 * SectionHeading.
 *
 * The standard editorial header: an index, an eyebrow, a display-weight
 * headline and an optional lead paragraph. Layout switches from a two-column
 * Swiss grid on desktop to a single stacked column on mobile, with the headline
 * deliberately wider than the lead so the eye lands on the heading first.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  index,
  tone = 'dark',
  align = 'start',
  action,
  className,
  titleClassName,
  as: Tag = 'h2',
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  index?: number;
  tone?: 'dark' | 'light';
  align?: 'start' | 'center';
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-8',
        !centered && action && 'lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-5', centered && 'items-center text-center')}>
        {(eyebrow || index !== undefined) && (
          <div className={cn('flex items-center gap-4', centered && 'justify-center')}>
            {index !== undefined && <SectionIndex index={index} />}
            {eyebrow && (
              <Eyebrow rule={false} tone={tone === 'light' ? 'light' : 'dark'}>
                {eyebrow}
              </Eyebrow>
            )}
          </div>
        )}

        <Tag
          className={cn(
            'text-title max-w-[22ch] font-medium',
            centered && 'max-w-[26ch]',
            tone === 'light' ? 'text-bone' : 'text-ink',
            titleClassName,
          )}
        >
          {title}
        </Tag>

        {lead && (
          <div
            className={cn(
              'text-lead max-w-[54ch]',
              tone === 'light' ? 'text-bone/70' : 'text-steel-deep',
            )}
          >
            {lead}
          </div>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Section shell. Owns vertical rhythm so no page has to remember the spacing
 * scale, and optionally inverts to the charcoal surface.
 */
export function Section({
  children,
  tone = 'light',
  size = 'default',
  className,
  id,
  as: Tag = 'section',
}: {
  children: ReactNode;
  tone?: 'light' | 'dark' | 'bone';
  size?: 'default' | 'compact' | 'spacious';
  className?: string;
  id?: string;
  as?: 'section' | 'div' | 'article' | 'footer';
}) {
  return (
    <Tag
      id={id}
      className={cn(
        'relative',
        tone === 'dark' && 'on-dark bg-ink text-bone',
        tone === 'bone' && 'bg-bone-deep',
        size === 'default' && 'py-[var(--spacing-section)]',
        size === 'compact' && 'py-[calc(var(--spacing-section)*0.6)]',
        size === 'spacious' && 'py-[calc(var(--spacing-section)*1.35)]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
