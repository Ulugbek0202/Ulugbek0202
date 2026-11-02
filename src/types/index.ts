import type { Locale } from '@/i18n/config';

/**
 * Domain model.
 *
 * Every visitor-facing string is a `Localized<T>` map rather than a bare
 * string, so the content layer can never accidentally serve an untranslated
 * value: the compiler forces all three locales to be considered.
 */
export type Localized<T = string> = Record<Locale, T>;

/** A localized field is optional on write, required once normalised. */
export type PartialLocalized<T = string> = Partial<Record<Locale, T>>;

export type ProjectStatus = 'completed' | 'ongoing' | 'upcoming';

export type ProjectCategory =
  | 'residential'
  | 'commercial'
  | 'infrastructure'
  | 'industrial'
  | 'public'
  | 'hospitality';

export interface ProjectMetric {
  label: Localized;
  value: Localized;
}

export interface Project {
  id: string;
  slug: string;
  title: Localized;
  client: Localized;
  location: Localized;
  category: ProjectCategory;
  status: ProjectStatus;
  year: number;
  /** Gross built area, square metres. `null` when not applicable. */
  areaSqm: number | null;
  summary: Localized;
  description: Localized;
  /** Bullet points describing the scope of works. */
  scope: Localized<string[]>;
  coverImage: string;
  gallery: string[];
  metrics: ProjectMetric[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  slug: string;
  title: Localized;
  summary: Localized;
  description: Localized;
  /** Lucide icon name, resolved at render time through an explicit registry. */
  icon: ServiceIcon;
  capabilities: Localized<string[]>;
  order: number;
  published: boolean;
}

export type ServiceIcon =
  | 'building'
  | 'blueprint'
  | 'crane'
  | 'hardhat'
  | 'layers'
  | 'route'
  | 'ruler'
  | 'shield'
  | 'warehouse'
  | 'wrench';

export interface Partner {
  id: string;
  name: string;
  /** Optional localised descriptor, e.g. "Structural engineering partner". */
  role: PartialLocalized;
  logoUrl: string | null;
  website: string | null;
  country: string | null;
  order: number;
  published: boolean;
}

export type DocumentKind = 'certificate' | 'license' | 'policy' | 'report' | 'tender';

export interface CompanyDocument {
  id: string;
  slug: string;
  title: Localized;
  description: Localized;
  kind: DocumentKind;
  /** Reference number shown on the card, e.g. "LIC-2024-001". */
  reference: string | null;
  issuedBy: Localized | null;
  issuedAt: string | null;
  expiresAt: string | null;
  fileUrl: string | null;
  fileSizeKb: number | null;
  order: number;
  published: boolean;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: Localized;
  excerpt: Localized;
  body: Localized;
  coverImage: string;
  category: Localized;
  author: string;
  publishedAt: string;
  published: boolean;
  featured: boolean;
}

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';

export interface Vacancy {
  id: string;
  slug: string;
  title: Localized;
  department: Localized;
  location: Localized;
  employmentType: EmploymentType;
  experience: Localized;
  summary: Localized;
  responsibilities: Localized<string[]>;
  requirements: Localized<string[]>;
  salaryRange: PartialLocalized | null;
  deadline: string | null;
  published: boolean;
  postedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: Localized;
  bio: Localized;
  photoUrl: string | null;
  /** Free-form credentials line, shown under the name. */
  credentials: Localized | null;
  order: number;
  published: boolean;
}

export interface Milestone {
  id: string;
  year: number;
  title: Localized;
  description: Localized;
  imageUrl: string | null;
}

export interface Statistic {
  id: string;
  label: Localized;
  value: number;
  suffix: Localized | null;
  /** Set when the figure is an illustrative placeholder, not a verified fact. */
  isDemo: boolean;
}

export interface Tender {
  id: string;
  reference: string;
  title: Localized;
  description: Localized;
  category: Localized;
  status: 'open' | 'closed' | 'awarded';
  publishedAt: string;
  deadline: string;
  fileUrl: string | null;
}

export interface Inquiry {
  id: string;
  type: InquiryType;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  locale: Locale;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export type InquiryType = 'contact' | 'partnership' | 'career' | 'tender';

export type InquiryStatus = 'new' | 'in-review' | 'responded' | 'archived';

export interface CompanyProfile {
  name: Localized;
  legalName: Localized;
  tagline: Localized;
  founded: number;
  description: Localized;
  mission: Localized;
  vision: Localized;
  values: Array<{ title: Localized; description: Localized }>;
  address: Localized;
  phones: string[];
  emails: string[];
  telegram: string;
  workingHours: Localized;
  /** Registration identifiers are intentionally blank until supplied. */
  registration: { taxId: string | null; license: string | null };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

export interface DashboardStats {
  projects: { total: number; ongoing: number; completed: number; upcoming: number };
  inquiries: { total: number; new: number; last7Days: number };
  news: { total: number; published: number };
  documents: { total: number };
  vacancies: { total: number; published: number };
}
