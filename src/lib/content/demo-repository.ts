import { company, milestones, statistics, teamMembers } from '@/data/company';
import { documents, partners } from '@/data/partners';
import { projects } from '@/data/projects';
import { news } from '@/data/news';
import { services } from '@/data/services';
import { tenders, vacancies } from '@/data/tenders';
import type { Locale } from '@/i18n/config';
import type {
  CompanyDocument,
  CompanyProfile,
  DashboardStats,
  Inquiry,
  Milestone,
  NewsArticle,
  Partner,
  Project,
  ProjectCategory,
  ProjectStatus,
  Service,
  Statistic,
  TeamMember,
  Tender,
  Vacancy,
} from '@/types';

/**
 * ============================================================================
 * CONTENT REPOSITORY
 * ============================================================================
 * A single interface with two implementations:
 *
 *   • `demoRepository`     — serves the static datasets in `src/data`.
 *   • `supabaseRepository` — queries PostgreSQL through Supabase.
 *
 * `getRepository()` selects between them from the environment. The public site
 * and the admin panel both talk to this interface, so switching from demo mode
 * to a real database requires no changes in the pages themselves.
 *
 * When Supabase is unconfigured, `isDemo` is true and the admin panel displays
 * a persistent banner making clear that writes are not persisted. The demo
 * implementation never pretends a write succeeded: mutations throw a
 * `DemoModeError`, which the API layer turns into an honest response.
 * ============================================================================
 */

export class DemoModeError extends Error {
  constructor(operation: string) {
    super(
      `"${operation}" requires a database. Supabase is not configured, so no data was changed.`,
    );
    this.name = 'DemoModeError';
  }
}

export interface ProjectFilters {
  status?: ProjectStatus | 'all';
  category?: ProjectCategory | 'all';
  featured?: boolean;
  limit?: number;
  excludeSlug?: string;
}

export interface ContentRepository {
  /** True when data comes from local files rather than a database. */
  readonly isDemo: boolean;

  // --- Reads -----------------------------------------------------------------
  getCompany(): Promise<CompanyProfile>;
  getStatistics(): Promise<Statistic[]>;
  getMilestones(): Promise<Milestone[]>;
  getTeam(): Promise<TeamMember[]>;

  getProjects(filters?: ProjectFilters): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | null>;

  getServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | null>;

  getPartners(): Promise<Partner[]>;
  getDocuments(kind?: CompanyDocument['kind'] | 'all'): Promise<CompanyDocument[]>;

  getNews(limit?: number): Promise<NewsArticle[]>;
  getNewsBySlug(slug: string): Promise<NewsArticle | null>;

  getTenders(): Promise<Tender[]>;
  getVacancies(): Promise<Vacancy[]>;
  getVacancyBySlug(slug: string): Promise<Vacancy | null>;

  // --- Admin reads -----------------------------------------------------------
  getInquiries(): Promise<Inquiry[]>;
  getInquiryById(id: string): Promise<Inquiry | null>;
  getDashboardStats(): Promise<DashboardStats>;

  // --- Admin writes ----------------------------------------------------------
  /** Persists a form submission. Implemented by the Supabase repository only. */
  createInquiry(input: Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Inquiry>;
  updateInquiryStatus(id: string, status: Inquiry['status']): Promise<void>;
  deleteRecord(table: string, id: string): Promise<void>;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function byNewest<T extends { publishedAt?: string; createdAt?: string; postedAt?: string }>(
  a: T,
  b: T,
): number {
  const dateOf = (item: T) =>
    new Date(item.publishedAt ?? item.postedAt ?? item.createdAt ?? 0).getTime();
  return dateOf(b) - dateOf(a);
}

function applyProjectFilters(list: Project[], filters: ProjectFilters = {}): Project[] {
  const { status, category, featured, limit, excludeSlug } = filters;

  let result = list.filter((project) => project.published);

  if (status && status !== 'all') {
    result = result.filter((project) => project.status === status);
  }
  if (category && category !== 'all') {
    result = result.filter((project) => project.category === category);
  }
  if (featured !== undefined) {
    result = result.filter((project) => project.featured === featured);
  }
  if (excludeSlug) {
    result = result.filter((project) => project.slug !== excludeSlug);
  }

  result = [...result].sort((a, b) => b.year - a.year);

  return limit ? result.slice(0, limit) : result;
}

/* -------------------------------------------------------------------------- */
/* Demo implementation                                                         */
/* -------------------------------------------------------------------------- */

class DemoRepository implements ContentRepository {
  readonly isDemo = true;

  /**
   * In demo mode, inquiries live in memory for the lifetime of the server
   * process. This is enough to exercise the admin UI and the form flow without
   * implying that anything was stored durably.
   */
  private inquiries: Inquiry[] = [];

  async getCompany() {
    return company;
  }

  async getStatistics() {
    return statistics;
  }

  async getMilestones() {
    return [...milestones].sort((a, b) => a.year - b.year);
  }

  async getTeam() {
    return [...teamMembers]
      .filter((member) => member.published)
      .sort((a, b) => a.order - b.order);
  }

  async getProjects(filters?: ProjectFilters) {
    return applyProjectFilters(projects, filters);
  }

  async getProjectBySlug(slug: string) {
    return projects.find((project) => project.slug === slug && project.published) ?? null;
  }

  async getServices() {
    return [...services].filter((service) => service.published).sort((a, b) => a.order - b.order);
  }

  async getServiceBySlug(slug: string) {
    return services.find((service) => service.slug === slug && service.published) ?? null;
  }

  async getPartners() {
    return [...partners].filter((partner) => partner.published).sort((a, b) => a.order - b.order);
  }

  async getDocuments(kind: CompanyDocument['kind'] | 'all' = 'all') {
    const list = [...documents]
      .filter((document) => document.published)
      .sort((a, b) => a.order - b.order);

    return kind === 'all' ? list : list.filter((document) => document.kind === kind);
  }

  async getNews(limit?: number) {
    const list = [...news].filter((article) => article.published).sort(byNewest);
    return limit ? list.slice(0, limit) : list;
  }

  async getNewsBySlug(slug: string) {
    return news.find((article) => article.slug === slug && article.published) ?? null;
  }

  async getTenders() {
    return [...tenders].sort(byNewest);
  }

  async getVacancies() {
    return [...vacancies].filter((vacancy) => vacancy.published).sort(byNewest);
  }

  async getVacancyBySlug(slug: string) {
    return vacancies.find((vacancy) => vacancy.slug === slug && vacancy.published) ?? null;
  }

  async getInquiries() {
    return [...this.inquiries].sort(byNewest);
  }

  async getInquiryById(id: string) {
    return this.inquiries.find((inquiry) => inquiry.id === id) ?? null;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return {
      projects: {
        total: projects.length,
        ongoing: projects.filter((p) => p.status === 'ongoing').length,
        completed: projects.filter((p) => p.status === 'completed').length,
        upcoming: projects.filter((p) => p.status === 'upcoming').length,
      },
      inquiries: {
        total: this.inquiries.length,
        new: this.inquiries.filter((i) => i.status === 'new').length,
        last7Days: this.inquiries.filter((i) => new Date(i.createdAt).getTime() >= weekAgo).length,
      },
      news: {
        total: news.length,
        published: news.filter((article) => article.published).length,
      },
      documents: { total: documents.length },
      vacancies: {
        total: vacancies.length,
        published: vacancies.filter((vacancy) => vacancy.published).length,
      },
    };
  }

  async createInquiry(
    input: Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Promise<Inquiry> {
    const now = new Date().toISOString();
    const inquiry: Inquiry = {
      ...input,
      id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    // Bounded so a long-running dev server cannot grow this list without limit.
    this.inquiries = [inquiry, ...this.inquiries].slice(0, 200);

    return inquiry;
  }

  async updateInquiryStatus(id: string, status: Inquiry['status']) {
    const index = this.inquiries.findIndex((inquiry) => inquiry.id === id);
    if (index === -1) throw new DemoModeError('updateInquiryStatus');

    this.inquiries[index] = {
      ...this.inquiries[index],
      status,
      updatedAt: new Date().toISOString(),
    };
  }

  async deleteRecord(): Promise<void> {
    throw new DemoModeError('deleteRecord');
  }
}

/** Singleton so the demo repository's in-memory inquiries survive HMR. */
const globalForDemo = globalThis as unknown as { __demoRepository?: DemoRepository };

export const demoRepository: DemoRepository =
  globalForDemo.__demoRepository ?? (globalForDemo.__demoRepository = new DemoRepository());
