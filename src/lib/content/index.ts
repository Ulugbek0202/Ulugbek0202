import 'server-only';

import { cache } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import {
  demoRepository,
  DemoModeError,
  type ContentRepository,
  type ProjectFilters,
} from './demo-repository';
import { SupabaseRepository } from './supabase-repository';

export { DemoModeError } from './demo-repository';
export type { ContentRepository, ProjectFilters } from './demo-repository';

/**
 * Resolves the active content repository.
 *
 * Supabase is used whenever it is configured. If a Supabase query fails at
 * runtime the error propagates — we do not silently fall back to demo data on a
 * configured deployment, because that would present invented projects as if
 * they were the company's real portfolio. Falling back is only correct when
 * Supabase was never configured in the first place.
 */
function resolveRepository(): ContentRepository {
  return isSupabaseConfigured ? new SupabaseRepository() : demoRepository;
}

/**
 * Request-scoped repository accessor.
 *
 * `cache()` dedupes calls within a single render pass, so a page that reads
 * projects in both the layout and the body issues one set of queries rather
 * than two. It does not persist across requests, which is what we want.
 */
export const getRepository = cache(async (): Promise<ContentRepository> => resolveRepository());

/** Synchronous variant for places that only need the demo-mode flag. */
export function isDemoMode(): boolean {
  return !isSupabaseConfigured;
}

/* -------------------------------------------------------------------------- */
/* Convenience readers — the API the pages actually use                        */
/* -------------------------------------------------------------------------- */

export const content = {
  company: () => getRepository().then((repo) => repo.getCompany()),
  statistics: () => getRepository().then((repo) => repo.getStatistics()),
  milestones: () => getRepository().then((repo) => repo.getMilestones()),
  team: () => getRepository().then((repo) => repo.getTeam()),

  projects: (filters?: ProjectFilters) => getRepository().then((repo) => repo.getProjects(filters)),
  project: (slug: string) => getRepository().then((repo) => repo.getProjectBySlug(slug)),

  services: () => getRepository().then((repo) => repo.getServices()),
  service: (slug: string) => getRepository().then((repo) => repo.getServiceBySlug(slug)),

  partners: () => getRepository().then((repo) => repo.getPartners()),
  documents: (kind?: Parameters<ContentRepository['getDocuments']>[0]) =>
    getRepository().then((repo) => repo.getDocuments(kind)),

  news: (limit?: number) => getRepository().then((repo) => repo.getNews(limit)),
  article: (slug: string) => getRepository().then((repo) => repo.getNewsBySlug(slug)),

  tenders: () => getRepository().then((repo) => repo.getTenders()),
  vacancies: () => getRepository().then((repo) => repo.getVacancies()),
  vacancy: (slug: string) => getRepository().then((repo) => repo.getVacancyBySlug(slug)),

  inquiries: () => getRepository().then((repo) => repo.getInquiries()),
  inquiry: (id: string) => getRepository().then((repo) => repo.getInquiryById(id)),
  dashboardStats: () => getRepository().then((repo) => repo.getDashboardStats()),
} as const;
