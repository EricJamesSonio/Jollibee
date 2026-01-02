import { fetchMenuItems } from "../services/menu.js";
import { menuState } from "../state/menu.js";
import { renderMenuItems } from "./menu-items.js";
import { qs, clear } from "../utils/dom.js";

const categoriesDiv = qs("#categories");
const categoryTitle = qs("#category-title");

export function renderCategories(categories) {
  const categoriesDiv = document.getElementById("categories");

  const categoryContainer = document.createElement("div");
  categoryContainer.className = "category-list";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat.name;
    btn.onclick = () => setActiveCategory(cat);
    categoryContainer.appendChild(btn);
  });

  const existingList = categoriesDiv.querySelector(".category-list");
  if (existingList) existingList.remove();

  categoriesDiv.appendChild(categoryContainer);
}


async function setActiveCategory(category) {
  if (menuState.activeCategoryCode === category.code) return;

  menuState.activeCategoryCode = category.code;
  categoryTitle.textContent = category.name;

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.classList.toggle("active", btn.textContent === category.name);
  });

  const items = await fetchMenuItems(category.code);
  renderMenuItems(items);
}
