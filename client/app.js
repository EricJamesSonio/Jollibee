import { fetchCategories } from "./services/menu.js";
import { menuState } from "./state/menu.js";
import { renderCategories } from "./ui/categories.js";
import { initCartSummary } from "./ui/cart-summary.js";

async function init() {
  try {
    initCartSummary();

    const categories = await fetchCategories();
    menuState.categories = categories;
    renderCategories(categories);

    const defaultCategory =
      categories.find(c => c.name.toLowerCase().includes("chicken")) ||
      categories[0];

    document.querySelectorAll(".category-btn")[0]?.click();
  } catch (err) {
    console.error(err);
  }
}

init();
