'use client';

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * ============================================================================
 * MOTION PRIMITIVES
 * ============================================================================
 * Every animation in the site is built from these components, which means the
 * `prefers-reduced-motion` decision is made in a handful of places rather than
 * scattered across forty. When reduced motion is requested, each primitive
 * degrades to a static render with the final state already applied — nothing
 * disappears and nothing is left mid-transition.
 *
 * Timing philosophy: entrances are slow enough to read as deliberate (0.75–1s)
 * and use a decelerating curve, so content arrives rather than snaps. Hover
 * states are faster (0.3–0.5s) because they must feel responsive.
 * ============================================================================
 */

/** The house easing curve. Fast out of the gate, long settle. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Shared viewport config: fire once, slightly before the element is centred. */
const VIEWPORT = { once: true, margin: '-12% 0px -12% 0px' } as const;

/* -------------------------------------------------------------------------- */
/* Reveal                                                                      */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  from = 'bottom',
  distance = 28,
  delay = 0,
  duration = 0.85,
  className,
  as = 'div',
  blur = false,
}: {
  children: ReactNode;
  /** Direction the element travels from. */
  from?: 'bottom' | 'top' | 'left' | 'right' | 'none';
  /** Distance travelled, in pixels. */
  distance?: number;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'article' | 'section' | 'header' | 'footer';
  /** Blur the element in from a soft focus, used for photographic reveals. */
  blur?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const offset =
    from === 'none'
      ? {}
      : from === 'bottom'
        ? { y: distance }
        : from === 'top'
          ? { y: -distance }
          : from === 'left'
            ? { x: -distance }
            : { x: distance };

  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/* Stagger                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Staggered container. Children wrapped in `StaggerItem` inherit the cadence
 * from the parent's variants rather than each computing its own delay, so the
 * rhythm stays even no matter how many items there are.
 */
export function Stagger({
  children,
  className,
  delayChildren = 0.08,
  stagger = 0.09,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
  as?: 'div' | 'ul' | 'ol';
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Component = motion[as];

  const container: Variants = {
    hidden: {},
    visible: { transition: { delayChildren, staggerChildren: stagger } },
  };

  return (
    <Component
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  distance = 24,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  as?: 'div' | 'li' | 'article';
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Component = motion[as];

  const item: Variants = {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
  };

  return (
    <Component className={className} variants={item}>
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/* Text                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Splits a headline into lines and lifts each out of an overflow-hidden mask in
 * sequence. The site's signature entrance for large type.
 *
 * Takes an array of lines rather than a string so the caller keeps control of
 * where the breaks fall — automatic wrapping would fight the mask.
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.11,
  duration = 1,
  as: Tag = 'span',
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    const StaticTag = Tag;
    return (
      <StaticTag className={className}>
        {lines.map((line, index) => (
          <span key={index} className={cn('block', lineClassName)}>
            {line}
          </span>
        ))}
      </StaticTag>
    );
  }

  const Container = motion[Tag];

  const container: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };

  const child: Variants = {
    hidden: { y: '108%' },
    visible: { y: '0%', transition: { duration, ease: EASE } },
  };

  return (
    <Container className={className} variants={container} initial="hidden" animate="visible">
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden pb-[0.08em]">
          <motion.span variants={child} className={cn('block', lineClassName)}>
            {line}
          </motion.span>
        </span>
      ))}
    </Container>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Vertical parallax. The element drifts as its container crosses the viewport.
 * Disabled under reduced motion, where it would be nauseating rather than
 * expressive.
 */
export function Parallax({
  children,
  className,
  /** Positive drifts slower than the page, negative faster. */
  speed = 0.14,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const distance = speed * 240;
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.4 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Counter                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Animated counter.
 *
 * Drives the DOM text node through a ref rather than through React state. A
 * state update per frame would re-render the subtree sixty times a second for a
 * single changing number; writing to `textContent` avoids that entirely and
 * keeps the animation smooth on low-end hardware.
 *
 * The final value is what gets rendered on the server and on first paint, so
 * the figure is always correct for search engines and screen readers.
 */
export function Counter({
  value,
  duration = 2200,
  className,
  format,
  suffix,
}: {
  value: number;
  /** Duration in milliseconds. */
  duration?: number;
  className?: string;
  /** Formats the current interpolated value for display. */
  format: (current: number) => string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduced || !inView) {
      node.textContent = format(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Quartic ease-out: brisk opening, long settle onto the final figure.
      const eased = 1 - Math.pow(1 - progress, 4);

      node.textContent = format(Math.round(value * eased));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // `format` is intentionally excluded: it is expected to be a stable
    // reference, and including it would restart the animation on every parent
    // render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value, duration]);

  return (
    <span className={className}>
      <span ref={ref} className="tabular-nums">
        {format(value)}
      </span>
      {suffix && <span className="ml-1 align-super text-[0.55em]">{suffix}</span>}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Image reveal                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Photographic reveal: the frame clips open while the image settles back from
 * slightly oversized. One coordinated gesture rather than three effects.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={cn('relative overflow-hidden', className)}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={VIEWPORT}
      transition={{ duration: 1.05, delay, ease: EASE }}
    >
      <motion.div
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.4, delay, ease: EASE }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Convenience re-export so consumers import motion APIs from one module. */
export { motion, useReducedMotion };
