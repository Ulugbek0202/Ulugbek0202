import { z } from 'zod';
import { locales } from '@/i18n/config';

/**
 * ============================================================================
 * VALIDATION SCHEMAS
 * ============================================================================
 * These are the authoritative validation rules. They run server-side in the API
 * routes before anything touches the database, and are reused client-side by
 * React Hook Form purely to give faster feedback.
 *
 * Error messages are translation keys, not prose. The API resolves them against
 * the submission's locale before responding, so validation messages appear in
 * the language the visitor is actually using.
 * ============================================================================
 */

/** Collapses whitespace and strips control characters from free text. */
const cleanText = (max: number) =>
  z
    .string()
    .transform((value) => value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim())
    .pipe(z.string().max(max, 'validation.messageMax'));

const requiredText = (min: number, max: number, minKey: string) =>
  z
    .string()
    .transform((value) => value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim())
    .pipe(z.string().min(min, minKey).max(max, 'validation.nameMax'));

/**
 * Email validation.
 *
 * Deliberately permissive on the local part (plus-addressing, dots, hyphens and
 * apostrophes are all legitimate) while requiring a dotted domain with a real
 * TLD. Overly strict patterns reject valid addresses, which is worse than
 * accepting one that later bounces.
 */
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.string().min(1, 'validation.required').max(254, 'validation.emailInvalid'))
  .refine(
    (value) =>
      /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value) &&
      !value.includes('..') &&
      !value.startsWith('.') &&
      !value.includes('@.'),
    { message: 'validation.emailInvalid' },
  );

/**
 * Telephone validation.
 *
 * Accepts the shapes people actually type — spaces, parentheses, hyphens, a
 * leading plus — and requires 7 to 20 digits, which covers national and
 * international numbers without pretending to know every national plan.
 */
const phoneField = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s()\-.\u2013\u2014]/g, ''))
  .refine((value) => /^\+?\d{7,20}$/.test(value), { message: 'validation.phoneInvalid' });

const optionalPhone = z.union([phoneField, z.literal('')]).optional().transform((v) => (v === '' ? undefined : v));

/**
 * Spam heuristics.
 *
 * `honeypot` is a field hidden from humans; anything in it means a bot filled
 * the form. `startedAt` measures how long the visitor spent on the page — a
 * submission arriving in under two seconds is almost certainly automated.
 */
const spamGuard = z
  .object({
    honeypot: z.string().max(0, 'forms.spamDetected').optional(),
    startedAt: z.number().int().nonnegative().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.honeypot && value.honeypot.length > 0) {
      ctx.addIssue({ code: 'custom', path: ['honeypot'], message: 'forms.spamDetected' });
    }

    if (value.startedAt !== undefined) {
      const elapsed = Date.now() - value.startedAt;
      // Allow a small negative window for clock skew between client and server.
      if (elapsed < 1_800) {
        ctx.addIssue({ code: 'custom', path: ['startedAt'], message: 'forms.spamDetected' });
      }
    }
  });

const consentField = z.literal(true, { message: 'validation.consentRequired' });

const localeField = z.enum(locales).default('uz');

/* -------------------------------------------------------------------------- */
/* Enquiry forms                                                               */
/* -------------------------------------------------------------------------- */

export const contactSchema = z
  .object({
    type: z.literal('contact'),
    name: requiredText(2, 120, 'validation.nameMin'),
    email: emailField,
    phone: optionalPhone,
    company: cleanText(160).optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
    subject: requiredText(3, 160, 'validation.subjectMin'),
    message: requiredText(20, 4000, 'validation.messageMin'),
    consent: consentField,
    locale: localeField,
  })
  .and(spamGuard);

export const partnershipSchema = z
  .object({
    type: z.literal('partnership'),
    name: requiredText(2, 120, 'validation.nameMin'),
    email: emailField,
    phone: optionalPhone,
    company: requiredText(2, 160, 'validation.nameMin'),
    subject: cleanText(160).optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
    message: requiredText(20, 4000, 'validation.messageMin'),
    consent: consentField,
    locale: localeField,
  })
  .and(spamGuard);

export const careerSchema = z
  .object({
    type: z.literal('career'),
    name: requiredText(2, 120, 'validation.nameMin'),
    email: emailField,
    phone: phoneField,
    company: cleanText(160).optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
    position: requiredText(2, 160, 'validation.positionRequired'),
    subject: cleanText(160).optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
    message: requiredText(20, 4000, 'validation.messageMin'),
    consent: consentField,
    locale: localeField,
  })
  .and(spamGuard);

export const tenderSchema = z
  .object({
    type: z.literal('tender'),
    name: requiredText(2, 120, 'validation.nameMin'),
    email: emailField,
    phone: optionalPhone,
    company: requiredText(2, 160, 'validation.nameMin'),
    tenderRef: requiredText(3, 80, 'validation.subjectMin'),
    subject: cleanText(160).optional().or(z.literal('')).transform((v) => (v === '' ? undefined : v)),
    message: requiredText(20, 4000, 'validation.messageMin'),
    consent: consentField,
    locale: localeField,
  })
  .and(spamGuard);

export const newsletterSchema = z
  .object({
    email: emailField,
    locale: localeField,
  })
  .and(spamGuard.partial());

/** Discriminated union of every form the public site accepts. */
export const submissionSchema = z.union([
  contactSchema,
  partnershipSchema,
  careerSchema,
  tenderSchema,
]);

export type ContactInput = z.infer<typeof contactSchema>;
export type PartnershipInput = z.infer<typeof partnershipSchema>;
export type CareerInput = z.infer<typeof careerSchema>;
export type TenderInput = z.infer<typeof tenderSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;

/* -------------------------------------------------------------------------- */
/* Admin forms                                                                 */
/* -------------------------------------------------------------------------- */

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'validation.required').max(200, 'validation.required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const inquiryStatusSchema = z.object({
  id: z.string().min(1, 'validation.required'),
  status: z.enum(['new', 'in-review', 'responded', 'archived']),
});

/** Strips control characters from a JSONB translation payload. */
const translationMap = z.record(z.string().max(60_000)).optional();

export const projectAdminSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .max(80, 'validation.nameMax')
    .regex(/^[a-z0-9\u0400-\u04ff-]+$/, 'validation.invalidSubmission'),
  status: z.enum(['completed', 'ongoing', 'upcoming']),
  category: z.enum(['residential', 'commercial', 'infrastructure', 'industrial', 'public', 'hospitality']),
  year: z.coerce.number().int().min(1900).max(2100),
  areaSqm: z.coerce.number().int().nonnegative().nullable().optional(),
  coverImage: z.string().max(500).optional().default(''),
  featured: z.coerce.boolean().optional().default(false),
  published: z.coerce.boolean().optional().default(true),
  translations: translationMap,
});

export type ProjectAdminInput = z.infer<typeof projectAdminSchema>;
