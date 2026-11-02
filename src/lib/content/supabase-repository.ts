import { createAdminClient } from '@/lib/supabase/admin';
import type {
  CompanyDocument,
  CompanyProfile,
  DashboardStats,
  Inquiry,
  Milestone,
  NewsArticle,
  Partner,
  Project,
  Service,
  Statistic,
  TeamMember,
  Tender,
  Vacancy,
} from '@/types';
import { DemoModeError, type ContentRepository, type ProjectFilters } from './demo-repository';
import {
  toCompanyProfile,
  toDocument,
  toInquiry,
  toMilestone,
  toNewsArticle,
  toPartner,
  toProject,
  toService,
  toStatistic,
  toTeamMember,
  toTender,
  toVacancy,
} from './mappers';

type Row = Record<string, unknown>;

/**
 * ============================================================================
 * SUPABASE-BACKED CONTENT REPOSITORY
 * ============================================================================
 * Reads go through the service-role client so that published content is served
 * consistently regardless of the visitor's session. This is deliberate: the
 * public site must render for anonymous visitors, and the `published` flag is
 * applied as an explicit filter on every query below rather than relying on a
 * policy that would also have to serve the admin panel.
 *
 * Writes are limited to the operations the public site genuinely performs
 * (recording an inquiry). All other mutations belong to the admin API routes,
 * which authorise the caller before touching the database.
 * ============================================================================
 */

function client() {
  const supabase = createAdminClient();
  if (!supabase) throw new DemoModeError('database access');
  return supabase;
}

function rows(data: unknown): Row[] {
  return Array.isArray(data) ? (data as Row[]) : [];
}

function row(data: unknown): Row | null {
  return data && typeof data === 'object' && !Array.isArray(data) ? (data as Row) : null;
}

export class SupabaseRepository implements ContentRepository {
  readonly isDemo = false;

  /* ---------------------------------------------------------------- company */

  async getCompany(): Promise<CompanyProfile> {
    const { data, error } = await client().from('company').select('*').limit(1).maybeSingle();
    if (error || !data) throw error ?? new Error('company record missing');
    return toCompanyProfile(row(data) ?? {});
  }

  async getStatistics(): Promise<Statistic[]> {
    const { data, error } = await client()
      .from('statistics')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return rows(data).map(toStatistic);
  }

  async getMilestones(): Promise<Milestone[]> {
    const { data, error } = await client()
      .from('milestones')
      .select('*')
      .order('year', { ascending: true });
    if (error) throw error;
    return rows(data).map(toMilestone);
  }

  async getTeam(): Promise<TeamMember[]> {
    const { data, error } = await client()
      .from('team_members')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return rows(data).map(toTeamMember);
  }

  /* --------------------------------------------------------------- projects */

  async getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
    let query = client().from('projects').select('*').eq('published', true);

    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
    if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
    if (filters.featured !== undefined) query = query.eq('featured', filters.featured);
    if (filters.excludeSlug) query = query.neq('slug', filters.excludeSlug);

    query = query.order('year', { ascending: false });
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw error;

    return rows(data).map((entry) => toProject(entry));
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const supabase = client();

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const project = row(data) as Row;
    const projectId = String(project.id);

    // Translations and gallery images are stored relationally; fetch both in
    // parallel and tolerate either being absent.
    const [translations, images] = await Promise.all([
      supabase.from('project_translations').select('*').eq('project_id', projectId),
      supabase
        .from('project_images')
        .select('url, display_order')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true }),
    ]);

    const gallery = rows(images.data)
      .map((entry) => String(entry.url ?? ''))
      .filter((url) => url.length > 0);

    return toProject(project, rows(translations.data), gallery);
  }

  /* --------------------------------------------------------------- services */

  async getServices(): Promise<Service[]> {
    const { data, error } = await client()
      .from('services')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return rows(data).map(toService);
  }

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const { data, error } = await client()
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();
    if (error) throw error;
    return data ? toService(row(data) ?? {}) : null;
  }

  /* --------------------------------------------------------------- partners */

  async getPartners(): Promise<Partner[]> {
    const { data, error } = await client()
      .from('partners')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return rows(data).map(toPartner);
  }

  async getDocuments(kind: CompanyDocument['kind'] | 'all' = 'all'): Promise<CompanyDocument[]> {
    let query = client().from('documents').select('*').eq('published', true);
    if (kind !== 'all') query = query.eq('kind', kind);

    const { data, error } = await query.order('display_order', { ascending: true });
    if (error) throw error;
    return rows(data).map(toDocument);
  }

  /* ------------------------------------------------------------------- news */

  async getNews(limit?: number): Promise<NewsArticle[]> {
    let query = client()
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) throw error;
    return rows(data).map(toNewsArticle);
  }

  async getNewsBySlug(slug: string): Promise<NewsArticle | null> {
    const { data, error } = await client()
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();
    if (error) throw error;
    return data ? toNewsArticle(row(data) ?? {}) : null;
  }

  /* --------------------------------------------------------------- tenders */

  async getTenders(): Promise<Tender[]> {
    const { data, error } = await client()
      .from('tenders')
      .select('*')
      .order('published_at', { ascending: false });
    if (error) throw error;
    return rows(data).map(toTender);
  }

  async getVacancies(): Promise<Vacancy[]> {
    const { data, error } = await client()
      .from('vacancies')
      .select('*')
      .eq('published', true)
      .order('posted_at', { ascending: false });
    if (error) throw error;
    return rows(data).map(toVacancy);
  }

  async getVacancyBySlug(slug: string): Promise<Vacancy | null> {
    const { data, error } = await client()
      .from('vacancies')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();
    if (error) throw error;
    return data ? toVacancy(row(data) ?? {}) : null;
  }

  /* ------------------------------------------------------------- inquiries */

  async getInquiries(): Promise<Inquiry[]> {
    const { data, error } = await client()
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return rows(data).map(toInquiry);
  }

  async getInquiryById(id: string): Promise<Inquiry | null> {
    const { data, error } = await client().from('inquiries').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? toInquiry(row(data) ?? {}) : null;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const supabase = client();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [projects, inquiries, newInquiries, recent, news, documents, vacancies] = await Promise.all([
      supabase.from('projects').select('status'),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
      supabase.from('news').select('published'),
      supabase.from('documents').select('id', { count: 'exact', head: true }),
      supabase.from('vacancies').select('published'),
    ]);

    const statuses = rows(projects.data).map((entry) => String(entry.status));
    const newsRows = rows(news.data);
    const vacancyRows = rows(vacancies.data);

    return {
      projects: {
        total: statuses.length,
        ongoing: statuses.filter((status) => status === 'ongoing').length,
        completed: statuses.filter((status) => status === 'completed').length,
        upcoming: statuses.filter((status) => status === 'upcoming').length,
      },
      inquiries: {
        total: inquiries.count ?? 0,
        new: newInquiries.count ?? 0,
        last7Days: recent.count ?? 0,
      },
      news: {
        total: newsRows.length,
        published: newsRows.filter((entry) => entry.published === true).length,
      },
      documents: { total: documents.count ?? 0 },
      vacancies: {
        total: vacancyRows.length,
        published: vacancyRows.filter((entry) => entry.published === true).length,
      },
    };
  }

  /* --------------------------------------------------------------- writes */

  async createInquiry(
    input: Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Promise<Inquiry> {
    const { data, error } = await client()
      .from('inquiries')
      .insert({
        type: input.type,
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        subject: input.subject,
        message: input.message,
        locale: input.locale,
        status: 'new',
      })
      .select('*')
      .single();

    if (error) throw error;
    return toInquiry(row(data) ?? {});
  }

  async updateInquiryStatus(id: string, status: Inquiry['status']): Promise<void> {
    const { error } = await client()
      .from('inquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  async deleteRecord(table: string, id: string): Promise<void> {
    // Allow-list: an arbitrary caller-supplied table name must never reach the
    // query builder, or this becomes a generic database-deletion primitive.
    const allowed = new Set([
      'projects',
      'project_images',
      'project_translations',
      'services',
      'partners',
      'documents',
      'news',
      'vacancies',
      'team_members',
      'milestones',
      'statistics',
      'tenders',
      'inquiries',
    ]);

    if (!allowed.has(table)) {
      throw new Error(`Refusing to delete from unknown table "${table}".`);
    }

    const { error } = await client().from(table).delete().eq('id', id);
    if (error) throw error;
  }
}
