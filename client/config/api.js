export const API_BASE = "http://localhost:8080";

export const API = {
  menu: {
    categories: () => `${API_BASE}/menu/categories`,
    itemsByCategory: code =>
      `${API_BASE}/menu/menu-items?category=${code}`,
  },

  // future
  cart: {
    base: () => `${API_BASE}/cart`,
  },
};
