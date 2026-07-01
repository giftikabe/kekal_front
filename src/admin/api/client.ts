/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = "https://kekal-back.kekal.workers.dev";

export const tokens = {
  getAccess: () => localStorage.getItem("admin_access_token"),
  getRefresh: () => localStorage.getItem("admin_refresh_token"),
  set: (access: string, refresh: string) => {
    localStorage.setItem("admin_access_token", access);
    localStorage.setItem("admin_refresh_token", refresh);
  },
  clear: () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
  },
};

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokens.getRefresh();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      tokens.clear();
      return null;
    }
    const data = await res.json();
    tokens.set(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    tokens.clear();
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const accessToken = tokens.getAccess();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) return request<T>(endpoint, options, false);
    tokens.clear();
    window.location.href = "/admin/login";
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  },
  logout: async () => {
    const refreshToken = tokens.getRefresh();
    if (refreshToken) {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    tokens.clear();
  },
};

export const brandApi = {
  getIdentity: () => api.get<any[]>("/admin/brand-identity"),
  updateIdentity: (id: string, body: unknown) =>
    api.patch(`/admin/brand-identity/${id}`, body),
  deleteIdentity: (id: string) => api.delete(`/admin/brand-identity/${id}`),
  createIdentity: (body: unknown) => api.post("/admin/brand-identity", body),
  getMessages: () => api.get<any[]>("/admin/brand-messages"),
  createMessage: (body: unknown) => api.post("/admin/brand-messages", body),
  updateMessage: (id: string, body: unknown) =>
    api.patch(`/admin/brand-messages/${id}`, body),
  deleteMessage: (id: string) => api.delete(`/admin/brand-messages/${id}`),
  getValues: () => api.get<any[]>("/admin/brand-values"),
  createValue: (body: unknown) => api.post("/admin/brand-values", body),
  updateValue: (id: string, body: unknown) =>
    api.patch(`/admin/brand-values/${id}`, body),
  deleteValue: (id: string) => api.delete(`/admin/brand-values/${id}`),
  getDesignerProfile: () => api.get<any[]>("/admin/designer-profile"),
  createDesignerProfile: (body: unknown) =>
    api.post("/admin/designer-profile", body),
  updateDesignerProfile: (id: string, body: unknown) =>
    api.patch(`/admin/designer-profile/${id}`, body),
  getContactInfo: () => api.get<any[]>("/admin/contact-info"),
  createContactInfo: (body: unknown) => api.post("/admin/contact-info", body),
  updateContactInfo: (id: string, body: unknown) =>
    api.patch(`/admin/contact-info/${id}`, body),
  deleteContactInfo: (id: string) => api.delete(`/admin/contact-info/${id}`),
  getAboutBlocks: () => api.get<any[]>("/admin/about-content-blocks"),
  createAboutBlock: (body: unknown) =>
    api.post("/admin/about-content-blocks", body),
  updateAboutBlock: (id: string, body: unknown) =>
    api.patch(`/admin/about-content-blocks/${id}`, body),
  deleteAboutBlock: (id: string) =>
    api.delete(`/admin/about-content-blocks/${id}`),
};

export const collectionsApi = {
  getAll: () => api.get<any[]>("/admin/collections"),
  create: (body: unknown) => api.post("/admin/collections", body),
  update: (id: string, body: unknown) =>
    api.patch(`/admin/collections/${id}`, body),
  delete: (id: string) => api.delete(`/admin/collections/${id}`),
};

export const productsApi = {
  getAll: () => api.get<any[]>("/admin/products"),
  getByCollection: (collectionId: string) =>
    api.get<any[]>(`/admin/products/by-collection/${collectionId}`),
  create: (body: unknown) => api.post("/admin/products", body),
  update: (id: string, body: unknown) =>
    api.patch(`/admin/products/${id}`, body),
  delete: (id: string) => api.delete(`/admin/products/${id}`),
};

export const eventsApi = {
  getAll: () => api.get<any[]>("/admin/events"),
  create: (body: unknown) => api.post("/admin/events", body),
  update: (id: string, body: unknown) => api.patch(`/admin/events/${id}`, body),
  delete: (id: string) => api.delete(`/admin/events/${id}`),
};

export const upcomingEventsApi = {
  getAll: () => api.get<any[]>("/admin/upcoming-events"),
  create: (body: unknown) => api.post("/admin/upcoming-events", body),
  update: (id: string, body: unknown) =>
    api.patch(`/admin/upcoming-events/${id}`, body),
  delete: (id: string) => api.delete(`/admin/upcoming-events/${id}`),
};

export const eventCategoriesApi = {
  getAll: () => api.get<any[]>("/admin/event-categories"),
  create: (body: unknown) => api.post("/admin/event-categories", body),
  delete: (id: string) => api.delete(`/admin/event-categories/${id}`),
};

export const pagesApi = {
  getAll: () => api.get<any[]>("/admin/pages"),
  create: (body: unknown) => api.post("/admin/pages", body),
  update: (id: string, body: unknown) => api.patch(`/admin/pages/${id}`, body),
  getSections: () => api.get<any[]>("/admin/page-sections"),
  getSectionsByPage: (pageId: string) =>
    api.get<any[]>(`/admin/page-sections/${pageId}`),
  createSection: (body: unknown) => api.post("/admin/page-sections", body),
  updateSection: (id: string, body: unknown) =>
    api.patch(`/admin/page-sections/${id}`, body),
  getSeo: () => api.get<any[]>("/admin/page-seo"),
  updateSeo: (id: string, body: unknown) =>
    api.patch(`/admin/page-seo/${id}`, body),
  createSeo: (body: unknown) => api.post("/admin/page-seo", body),
  getNavigation: () => api.get<any[]>("/admin/navigation"),
  createNavigation: (body: unknown) => api.post("/admin/navigation", body),
  updateNavigation: (id: string, body: unknown) =>
    api.patch(`/admin/navigation/${id}`, body),
  deleteNavigation: (id: string) => api.delete(`/admin/navigation/${id}`),
};

export const usersApi = {
  getAll: () => api.get<any[]>("/admin/users"),
  create: (body: unknown) => api.post("/admin/users", body),
  update: (id: string, body: unknown) => api.patch(`/admin/users/${id}`, body),
  delete: (id: string) => api.delete(`/admin/users/${id}`),
  changePassword: (body: unknown) =>
    api.patch("/admin/users/me/password", body),
  getRoles: () => api.get<any[]>("/admin/users/roles"),
  createRole: (body: unknown) => api.post("/admin/users/roles", body),
  deleteRole: (id: string) => api.delete(`/admin/users/roles/${id}`),
  getRolePermissions: (roleId: string) =>
    api.get<any[]>(`/admin/users/roles/${roleId}/permissions`),
  addRolePermission: (roleId: string, body: unknown) =>
    api.post(`/admin/users/roles/${roleId}/permissions`, body),
  deleteRolePermission: (roleId: string, permissionId: string) =>
    api.delete(`/admin/users/roles/${roleId}/permissions/${permissionId}`),
  getUserPermissions: (userId: string) =>
    api.get<any[]>(`/admin/users/${userId}/permissions`),
  addUserPermission: (userId: string, body: unknown) =>
    api.post(`/admin/users/${userId}/permissions`, body),
  deleteUserPermission: (userId: string, permissionId: string) =>
    api.delete(`/admin/users/${userId}/permissions/${permissionId}`),
};
