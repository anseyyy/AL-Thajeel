const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "althajeel_admin_token";
const USER_KEY = "althajeel_admin_user";

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthData = (token, user) => {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_KEY);
  try {
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const clearAuthData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Generic API request wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const token = getAuthToken();

  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set JSON content type
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && options.body && typeof options.body === "object") {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg =
        data?.message || `Request failed with status code ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status === 401 && typeof window !== "undefined") {
      // If unauthorized on protected route, clear stored auth
      if (!window.location.pathname.includes("/admin/login")) {
        clearAuthData();
      }
    }
    throw error;
  }
}

export const api = {
  auth: {
    login: (credentials) =>
      request("/auth/login", {
        method: "POST",
        body: credentials,
      }),
    getMe: () =>
      request("/auth/me", {
        method: "GET",
      }),
  },

  public: {
    getProperties: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      return request(`/properties${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
      });
    },
    getPropertyBySlug: (slug) =>
      request(`/properties/${slug}`, {
        method: "GET",
      }),
    submitContact: (data) =>
      request("/contact", {
        method: "POST",
        body: data,
      }),
    getTestimonials: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      return request(`/testimonials${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
      });
    },
    getTestimonialById: (id) =>
      request(`/testimonials/${id}`, {
        method: "GET",
      }),
  },

  admin: {
    getProperties: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      return request(`/admin/properties${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
      });
    },

    getPropertyById: (id) =>
      request(`/admin/properties/${id}`, {
        method: "GET",
      }),

    createProperty: (formDataOrJson) =>
      request("/admin/properties", {
        method: "POST",
        body: formDataOrJson,
      }),

    updateProperty: (id, formDataOrJson) =>
      request(`/admin/properties/${id}`, {
        method: "PUT",
        body: formDataOrJson,
      }),

    deleteProperty: (id) =>
      request(`/admin/properties/${id}`, {
        method: "DELETE",
      }),

    // Contact inquiries
    getContacts: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      return request(`/admin/contacts${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
      });
    },

    getContactById: (id) =>
      request(`/admin/contacts/${id}`, {
        method: "GET",
      }),

    updateContactStatus: (id, data) =>
      request(`/admin/contacts/${id}`, {
        method: "PATCH",
        body: data,
      }),

    deleteContact: (id) =>
      request(`/admin/contacts/${id}`, {
        method: "DELETE",
      }),

    // Testimonials
    getTestimonials: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      return request(`/admin/testimonials${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
      });
    },

    getTestimonialById: (id) =>
      request(`/admin/testimonials/${id}`, {
        method: "GET",
      }),

    createTestimonial: (formDataOrJson) =>
      request("/admin/testimonials", {
        method: "POST",
        body: formDataOrJson,
      }),

    updateTestimonial: (id, formDataOrJson) =>
      request(`/admin/testimonials/${id}`, {
        method: "PUT",
        body: formDataOrJson,
      }),

    deleteTestimonial: (id) =>
      request(`/admin/testimonials/${id}`, {
        method: "DELETE",
      }),
  },
};

export default api;
