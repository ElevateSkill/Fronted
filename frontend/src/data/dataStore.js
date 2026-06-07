// Local data store utility. Used by the admin dashboard for local state management.
// All public-facing pages now fetch real data from the backend API.
const STORE_KEY = 'elevate_data';

const defaults = {
  heroSlides: [],
  courses: [],
  testimonials: [],
  posts: [],
  announcements: [],
  faqs: [],
  stories: [],
  partners: [],
  services: [],
  users: [],
};

export function loadData(key) {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const store = JSON.parse(raw);
      if (store[key] && store[key].length > 0) return store[key];
    }
  } catch {}
  return defaults[key] || [];
}

export function saveData(key, value) {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    store[key] = value;
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

export function clearData(key) {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const store = JSON.parse(raw);
    if (key) delete store[key];
    else Object.keys(store).forEach((k) => delete store[k]);
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

export { defaults };
export default defaults;