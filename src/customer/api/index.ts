/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = "https://kekal-back.kekal.workers.dev";

async function get<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Brand ────────────────────────────────────────────────────────────────────
export const brandApi = {
  getIdentity: () => get<any[]>("/brand-identity"),
  getIdentityByKey: (key: string) => get<any>(`/brand-identity/${key}`),
  getMessages: () => get<any[]>("/brand-messages"),
  getMessageByKey: (key: string) => get<any>(`/brand-messages/${key}`),
  getValues: () => get<any[]>("/brand-values"),
  getDesignerProfile: () => get<any[]>("/designer-profile"),
  getContactInfo: () => get<any[]>("/contact-info"),
  getAboutBlocks: () => get<any[]>("/about-content-blocks"),
};

// ─── Navigation ───────────────────────────────────────────────────────────────
export const navigationApi = {
  getAll: () => get<any[]>("/navigation"),
};

// ─── Collections ─────────────────────────────────────────────────────────────
export const collectionsApi = {
  getAll: () => get<any[]>("/collections"),
  getFeatured: () => get<any[]>("/collections/featured"),
  getLatest: () => get<any[]>("/collections/latest"),
  getBySlug: (slug: string) => get<any>(`/collections/${slug}`),
};

// ─── Products ────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: () => get<any[]>("/products"),
  getBySlug: (slug: string) => get<any>(`/products/${slug}`),
  getByCollection: (collectionId: string) => get<any[]>(`/products/by-collection/${collectionId}`),
};

// ─── Events ──────────────────────────────────────────────────────────────────
export const eventsApi = {
  getAll: () => get<any[]>("/events"),
  getBySlug: (slug: string) => get<any>(`/events/${slug}`),
  getFeatured: () => get<any[]>("/events/featured"),
  getPast: () => get<any[]>("/events/past"),
  getCommunityImpact: () => get<any[]>("/events/community-impact"),
  getRelated: (slug: string) => get<any[]>(`/events/${slug}/related`),
};

// ─── Upcoming Events ──────────────────────────────────────────────────────────
export const upcomingEventsApi = {
  getAll: () => get<any[]>("/upcoming-events"),
  getFeatured: () => get<any[]>("/upcoming-events/featured"),
  getBySlug: (slug: string) => get<any>(`/upcoming-events/${slug}`),
};

// ─── Pages & SEO ─────────────────────────────────────────────────────────────
export const pagesApi = {
  getAll: () => get<any[]>("/pages"),
  getSections: () => get<any[]>("/page-sections"),
  getSectionsByPage: (pageId: string) => get<any[]>(`/page-sections/${pageId}`),
  getSectionByPageAndName: (pageId: string, sectionName: string) =>
    get<any>(`/page-sections/${pageId}/${sectionName}`),
  getSeoByRoute: (route: string) =>
    get<any>(`/page-seo/by-route?route=${encodeURIComponent(route)}`),
};
