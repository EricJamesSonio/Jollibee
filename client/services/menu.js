import { API } from "../config/api.js";

export async function fetchCategories() {
  const res = await fetch(API.menu.categories());
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchMenuItems(categoryCode) {
  const res = await fetch(API.menu.itemsByCategory(categoryCode));
  if (!res.ok) throw new Error("Failed to fetch menu items");
  return res.json();
}
