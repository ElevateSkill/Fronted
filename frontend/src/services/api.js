import axios from 'axios';

// Backend is a Django REST Framework API under /api/v1/
// See: backend/docs/api_contract.md
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

// ===================== AUTH =====================
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData).then((r) => r.data),
  login: (credentials) => api.post('/auth/login/', credentials).then((r) => r.data),
  logout: (refresh) => api.post('/auth/logout/', { refresh }).then((r) => r.data),
  getProfile: () => api.get('/profile/').then((r) => r.data),
  updateProfile: (data) => api.put('/profile/', data).then((r) => r.data)
};

// ===================== HOMEPAGE (aggregated CMS) =====================
// Returns: { hero, about, site_settings, testimonials, faqs }
export const homepageAPI = {
  get: () => api.get('/homepage/').then((r) => r.data)
};

// ===================== COURSES =====================
export const coursesAPI = {
  list: (params = {}) => api.get('/courses/', { params }).then((r) => r.data),
  get: (id) => api.get(`/courses/${id}/`).then((r) => r.data),
  // Admin
  adminList: (params = {}) => api.get('/admin/courses/', { params }).then((r) => r.data),
  adminCreate: (data) => api.post('/admin/courses/', data).then((r) => r.data),
  adminUpdate: (id, data) => api.patch(`/admin/courses/${id}/`, data).then((r) => r.data),
  adminDelete: (id) => api.delete(`/admin/courses/${id}/`).then((r) => r.data)
};

// ===================== CATEGORIES =====================
export const categoriesAPI = {
  list: () => api.get('/categories/').then((r) => r.data),
  get: (id) => api.get(`/categories/${id}/`).then((r) => r.data)
};

// ===================== TESTIMONIALS =====================
// Public testimonials are only available via /homepage/ (filtered is_active=true)
// Admin can list all testimonials regardless of is_active
export const testimonialsAPI = {
  // Use the homepage endpoint to get only active testimonials
  active: () => homepageAPI.get().then((r) => r.testimonials || []),
  adminList: (params = {}) => api.get('/admin/testimonials/', { params }).then((r) => r.data),
  adminCreate: (data) => api.post('/admin/testimonials/', data).then((r) => r.data),
  adminUpdate: (id, data) => api.patch(`/admin/testimonials/${id}/`, data).then((r) => r.data),
  adminDelete: (id) => api.delete(`/admin/testimonials/${id}/`).then((r) => r.data)
};

// ===================== ANNOUNCEMENTS =====================
export const announcementsAPI = {
  // Authenticated: list published announcements
  list: (params = {}) => api.get('/announcements/', { params }).then((r) => r.data),
  get: (id) => api.get(`/announcements/${id}/`).then((r) => r.data),
  // Admin
  adminList: (params = {}) => api.get('/admin/announcements/', { params }).then((r) => r.data),
  adminCreate: (data) => api.post('/admin/announcements/', data).then((r) => r.data),
  adminUpdate: (id, data) => api.patch(`/admin/announcements/${id}/`, data).then((r) => r.data),
  adminDelete: (id) => api.delete(`/admin/announcements/${id}/`).then((r) => r.data)
};

// ===================== NEWS / BLOG =====================
export const newsAPI = {
  list: (params = {}) => api.get('/news/', { params }).then((r) => r.data),
  get: (id) => api.get(`/news/${id}/`).then((r) => r.data),
  adminList: (params = {}) => api.get('/admin/news/', { params }).then((r) => r.data),
  adminCreate: (data) => api.post('/admin/news/', data).then((r) => r.data),
  adminUpdate: (id, data) => api.patch(`/admin/news/${id}/`, data).then((r) => r.data),
  adminDelete: (id) => api.delete(`/admin/news/${id}/`).then((r) => r.data)
};

// ===================== FAQs =====================
export const faqsAPI = {
  // Active FAQs come from the homepage payload
  active: () => homepageAPI.get().then((r) => r.faqs || []),
  adminList: (params = {}) => api.get('/admin/faqs/', { params }).then((r) => r.data),
  adminCreate: (data) => api.post('/admin/faqs/', data).then((r) => r.data),
  adminUpdate: (id, data) => api.patch(`/admin/faqs/${id}/`, data).then((r) => r.data),
  adminDelete: (id) => api.delete(`/admin/faqs/${id}/`).then((r) => r.data)
};

// ===================== CMS — Hero / About / Settings (Admin) =====================
export const cmsAPI = {
  getHero: () => api.get('/admin/hero/').then((r) => r.data),
  updateHero: (data) => api.put('/admin/hero/', data).then((r) => r.data),
  getAbout: () => api.get('/admin/about/').then((r) => r.data),
  updateAbout: (data) => api.put('/admin/about/', data).then((r) => r.data),
  getSiteSettings: () => api.get('/admin/site-settings/').then((r) => r.data),
  updateSiteSettings: (data) => api.put('/admin/site-settings/', data).then((r) => r.data)
};

// ===================== ENROLLMENTS =====================
export const enrollmentsAPI = {
  enroll: (courseId) => api.post('/enrollments/', { course: courseId }).then((r) => r.data),
  myEnrollments: () => api.get('/my-enrollments/').then((r) => r.data)
};

// ===================== PAYMENTS =====================
export const paymentsAPI = {
  // Student: submit proof
  submitProof: (formData) => api.post('/payments/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((r) => r.data),
  // Student: my payments
  myPayments: () => api.get('/payments/').then((r) => r.data),
  // Admin
  adminList: (params = {}) => api.get('/admin/payments/', { params }).then((r) => r.data),
  adminApprove: (id) => api.put(`/admin/payments/${id}/approve/`).then((r) => r.data),
  adminReject: (id) => api.put(`/admin/payments/${id}/reject/`).then((r) => r.data)
};

// ===================== ADMIN — Dashboard stats =====================
export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard/').then((r) => r.data)
};

// ===================== SCHEMA / DOCS =====================
export const schemaAPI = {
  json: () => api.get('/schema/').then((r) => r.data)
};

// ===================== MEDIA UTILITY =====================
export function getMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/media/')) {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    const origin = base.replace(/\/api\/.*$/, '');
    return `${origin}${path}`;
  }
  return path;
}

// Backwards-compatible legacy exports
export const postsAPI = newsAPI; // alias
export const heroSlidesAPI = {
  active: () => homepageAPI.get().then((r) => r.hero || []),
  list: () => homepageAPI.get().then((r) => r.hero || []),
};
export const register = authAPI.register;
export const login = authAPI.login;
export const submitPaymentProof = paymentsAPI.submitProof;
export const fetchPaymentHistory = paymentsAPI.myPayments;

export { api };
export default api;
