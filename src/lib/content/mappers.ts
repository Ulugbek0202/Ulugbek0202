import type { Locale } from '@/i18n/config';
import type {
  CompanyDocument,
  CompanyProfile,
  Inquiry,
  Milestone,
  NewsArticle,
  Partner,
  Project,
  ProjectCategory,
  ProjectStatus,
  Service,
  ServiceIcon,
  Statistic,
  TeamMember,
  Tender,
  Vacancy,
} from '@/types';

/**
 * ============================================================================
 * DATABASE ROW → DOMAIN MAPPERS
 * ============================================================================
 * Supabase returns `snake_case` columns and stores translations either as
 * `jsonb` columns (`{uz, ru, en}`) or, for the child tables, as rows joined by
 * locale. These mappers normalise both shapes into the domain types in
 * `@/types` so the rest of the application never touches raw rows.
 *
 * They are deliberately total: a missing field yields a defined fallback rather
 * than `undefined`, so a partially populated row can never crash a page render.
 * ============================================================================
 */

type Row = Record<string, unknown>;

const LOCALES: Locale[] = ['uz', 'ru', 'en'];

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function num(value: unknown, fallback: number | null = null): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function iso(value: unknown, fallback = new Date(0).toISOString()): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function arr(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

/**
 * Reads a translated field. Accepts either a `jsonb` object (`{uz, ru, en}`) or
 * a plain string, which is treated as the value for every locale.
 */
function localized<T = string>(value: unknown, fallback: T | null = null): Record<Locale, T> | null {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    return { uz: value as unknown as T, ru: value as unknown as T, en: value as unknown as T };
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const source = value as Record<string, unknown>;
    const output = {} as Record<Locale, T>;

    for (const locale of LOCALES) {
      const entry = source[locale];
      if (entry !== undefined && entry !== null) {
        output[locale] = entry as T;
      }
    }

    return Object.keys(output).length > 0 ? output : null;
  }

  return fallback === null ? null : ({ uz: fallback, ru: fallback, en: fallback } as Record<Locale, T>);
}

/**
 * Merges base translation rows (one per locale) into a single localized object.
 * Used for child tables such as `project_translations`.
 */
function mergeTranslations(rows: Row[], field: string): Record<Locale, unknown> | null {
  const output: Partial<Record<Locale, unknown>> = {};

  for (const row of rows) {
    const locale = str(row.locale) as Locale;
    if (!LOCALES.includes(locale)) continue;

    const value = row[field];
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value.trim() === '') continue;

    output[locale] = value;
  }

  return Object.keys(output).length > 0 ? (output as Record<Locale, unknown>) : null;
}

/* -------------------------------------------------------------------------- */
/* Company                                                                     */
/* -------------------------------------------------------------------------- */

export function toCompanyProfile(row: Row): CompanyProfile {
  return {
    name: localized<string>(row.name) ?? { uz: 'Company', ru: 'Company', en: 'Company' },
    legalName: localized<string>(row.legal_name) ?? { uz: '', ru: '', en: '' },
    tagline: localized<string>(row.tagline) ?? { uz: '', ru: '', en: '' },
    founded: num(row.founded, new Date().getFullYear()) ?? new Date().getFullYear(),
    description: localized<string>(row.description) ?? { uz: '', ru: '', en: '' },
    mission: localized<string>(row.mission) ?? { uz: '', ru: '', en: '' },
    vision: localized<string>(row.vision) ?? { uz: '', ru: '', en: '' },
    values: Array.isArray(row.values)
      ? (row.values as Row[]).map((entry) => ({
          title: localized<string>(entry.title) ?? { uz: '', ru: '', en: '' },
          description: localized<string>(entry.description) ?? { uz: '', ru: '', en: '' },
        }))
      : [],
    address: localized<string>(row.address) ?? { uz: '', ru: '', en: '' },
    phones: arr(row.phones),
    emails: arr(row.emails),
    telegram: str(row.telegram),
    workingHours: localized<string>(row.working_hours) ?? { uz: '', ru: '', en: '' },
    registration: {
      taxId: typeof row.tax_id === 'string' ? row.tax_id : null,
      license: typeof row.license === 'string' ? row.license : null,
    },
  };
}

export function toStatistic(row: Row): Statistic {
  return {
    id: str(row.id),
    label: localized<string>(row.label) ?? { uz: '', ru: '', en: '' },
    value: num(row.value, 0) ?? 0,
    suffix: localized<string>(row.suffix),
    isDemo: bool(row.is_demo, true),
  };
}

export function toMilestone(row: Row): Milestone {
  return {
    id: str(row.id),
    year: num(row.year, 0) ?? 0,
    title: localized<string>(row.title) ?? { uz: '', ru: '', en: '' },
    description: localized<string>(row.description) ?? { uz: '', ru: '', en: '' },
    imageUrl: typeof row.image_url === 'string' ? row.image_url : null,
  };
}

export function toTeamMember(row: Row): TeamMember {
  return {
    id: str(row.id),
    name: str(row.name, 'Unnamed'),
    role: localized<string>(row.role) ?? { uz: '', ru: '', en: '' },
    bio: localized<string>(row.bio) ?? { uz: '', ru: '', en: '' },
    photoUrl: typeof row.photo_url === 'string' ? row.photo_url : null,
    credentials: localized<string>(row.credentials),
    order: num(row.display_order, 0) ?? 0,
    published: bool(row.published, true),
  };
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export function toProject(row: Row, translations: Row[] = [], gallery: string[] = []): Project {
  const merged = {
    title: mergeTranslations(translations, 'title'),
    summary: mergeTranslations(translations, 'summary'),
    description: mergeTranslations(translations, 'description'),
    location: mergeTranslations(translations, 'location'),
    client: mergeTranslations(translations, 'client'),
  };

  const scopeByLocale: Partial<Record<Locale, string[]>> = {};
  for (const translation of translations) {
    const locale = str(translation.locale) as Locale;
    if (!LOCALES.includes(locale)) continue;
    const scope = arr(translation.scope);
    if (scope.length > 0) scopeByLocale[locale] = scope;
  }

  return {
    id: str(row.id),
    slug: str(row.slug),
    title: localized<string>(row.title ?? merged.title) ?? { uz: '', ru: '', en: '' },
    client: localized<string>(row.client ?? merged.client) ?? { uz: '', ru: '', en: '' },
    location: localized<string>(row.location ?? merged.location) ?? { uz: '', ru: '', en: '' },
    category: str(row.category, 'commercial') as ProjectCategory,
    status: str(row.status, 'ongoing') as ProjectStatus,
    year: num(row.year, new Date().getFullYear()) ?? new Date().getFullYear(),
    areaSqm: num(row.area_sqm),
    summary: localized<string>(row.summary ?? merged.summary) ?? { uz: '', ru: '', en: '' },
    description: localized<string>(row.description ?? merged.description) ?? { uz: '', ru: '', en: '' },
    scope: Object.keys(scopeByLocale).length > 0 ? (scopeByLocale as Project['scope']) : { uz: [], ru: [], en: [] },
    coverImage: str(row.cover_image),
    gallery: gallery.length > 0 ? gallery : arr(row.gallery),
    metrics: Array.isArray(row.metrics)
      ? (row.metrics as Row[]).map((entry) => ({
          label: localized<string>(entry.label) ?? { uz: '', ru: '', en: '' },
          value: localized<string>(entry.value) ?? { uz: '', ru: '', en: '' },
        }))
      : [],
    featured: bool(row.featured),
    published: bool(row.published, true),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

/* -------------------------------------------------------------------------- */
/* Services, partners, documents                                               */
/* -------------------------------------------------------------------------- */

export function toService(row: Row): Service {
  return {
    id: str(row.id),
    slug: str(row.slug),
    title: localized<string>(row.title) ?? { uz: '', ru: '', en: '' },
    summary: localized<string>(row.summary) ?? { uz: '', ru: '', en: '' },
    description: localized<string>(row.description) ?? { uz: '', ru: '', en: '' },
    icon: str(row.icon, 'building') as ServiceIcon,
    capabilities: localized<string[]>(row.capabilities) ?? { uz: [], ru: [], en: [] },
    order: num(row.display_order, 0) ?? 0,
    published: bool(row.published, true),
  };
}

export function toPartner(row: Row): Partner {
  return {
    id: str(row.id),
    name: str(row.name, 'Partner'),
    role: localized<string>(row.role) ?? {},
    logoUrl: typeof row.logo_url === 'string' ? row.logo_url : null,
    website: typeof row.website === 'string' ? row.website : null,
    country: typeof row.country === 'string' ? row.country : null,
    order: num(row.display_order, 0) ?? 0,
    published: bool(row.published, true),
  };
}

export function toDocument(row: Row): CompanyDocument {
  return {
    id: str(row.id),
    slug: str(row.slug),
    title: localized<string>(row.title) ?? { uz: '', ru: '', en: '' },
    description: localized<string>(row.description) ?? { uz: '', ru: '', en: '' },
    kind: str(row.kind, 'certificate') as CompanyDocument['kind'],
    reference: typeof row.reference === 'string' ? row.reference : null,
    issuedBy: localized<string>(row.issued_by),
    issuedAt: typeof row.issued_at === 'string' ? row.issued_at : null,
    expiresAt: typeof row.expires_at === 'string' ? row.expires_at : null,
    fileUrl: typeof row.file_url === 'string' ? row.file_url : null,
    fileSizeKb: num(row.file_size_kb),
    order: num(row.display_order, 0) ?? 0,
    published: bool(row.published, true),
  };
}

/* -------------------------------------------------------------------------- */
/* News, tenders, vacancies                                                    */
/* -------------------------------------------------------------------------- */

export function toNewsArticle(row: Row): NewsArticle {
  return {
    id: str(row.id),
    slug: str(row.slug),
    title: localized<string>(row.title) ?? { uz: '', ru: '', en: '' },
    excerpt: localized<string>(row.excerpt) ?? { uz: '', ru: '', en: '' },
    body: localized<string>(row.body) ?? { uz: '', ru: '', en: '' },
    coverImage: str(row.cover_image),
    category: localized<string>(row.category) ?? { uz: '', ru: '', en: '' },
    author: str(row.author, 'Editorial Team'),
    publishedAt: iso(row.published_at),
    published: bool(row.published, true),
    featured: bool(row.featured),
  };
}

export function toTender(row: Row): Tender {
  return {
    id: str(row.id),
    reference: str(row.reference),
    title: localized<string>(row.title) ?? { uz: '', ru: '', en: '' },
    description: localized<string>(row.description) ?? { uz: '', ru: '', en: '' },
    category: localized<string>(row.category) ?? { uz: '', ru: '', en: '' },
    status: str(row.status, 'open') as Tender['status'],
    publishedAt: iso(row.published_at),
    deadline: iso(row.deadline),
    fileUrl: typeof row.file_url === 'string' ? row.file_url : null,
  };
}

export function toVacancy(row: Row): Vacancy {
  return {
    id: str(row.id),
    slug: str(row.slug),
    title: localized<string>(row.title) ?? { uz: '', ru: '', en: '' },
    department: localized<string>(row.department) ?? { uz: '', ru: '', en: '' },
    location: localized<string>(row.location) ?? { uz: '', ru: '', en: '' },
    employmentType: str(row.employment_type, 'full-time') as Vacancy['employmentType'],
    experience: localized<string>(row.experience) ?? { uz: '', ru: '', en: '' },
    summary: localized<string>(row.summary) ?? { uz: '', ru: '', en: '' },
    responsibilities: localized<string[]>(row.responsibilities) ?? { uz: [], ru: [], en: [] },
    requirements: localized<string[]>(row.requirements) ?? { uz: [], ru: [], en: [] },
    salaryRange: localized<string>(row.salary_range),
    deadline: typeof row.deadline === 'string' ? row.deadline : null,
    published: bool(row.published, true),
    postedAt: iso(row.posted_at),
  };
}

export function toInquiry(row: Row): Inquiry {
  return {
    id: str(row.id),
    type: str(row.type, 'contact') as Inquiry['type'],
    name: str(row.name),
    email: str(row.email),
    phone: typeof row.phone === 'string' ? row.phone : null,
    company: typeof row.company === 'string' ? row.company : null,
    subject: typeof row.subject === 'string' ? row.subject : null,
    message: str(row.message),
    locale: (str(row.locale, 'uz') as Locale) satisfies Locale,
    status: str(row.status, 'new') as Inquiry['status'],
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at ?? row.created_at),
  };
}
