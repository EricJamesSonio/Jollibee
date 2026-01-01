const API_BASE = "http://localhost:8080";

const categoriesDiv = document.getElementById("categories");
const menuItemsDiv = document.getElementById("menu-items");

// Fetch categories from menu service
async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/menu/categories`);
    const categories = await res.json();
    renderCategories(categories);
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
}

// Render category buttons
function renderCategories(categories) {
  categoriesDiv.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.name;
    btn.classList.add("category-btn");
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      fetchMenuItems(cat.code);
    });
    categoriesDiv.appendChild(btn);
  });
}

// Fetch menu items for a category
async function fetchMenuItems(categoryCode) {
  try {
    const res = await fetch(`${API_BASE}/menu/menu-items?category=${categoryCode}`);
    const items = await res.json();
    renderMenuItems(items);
  } catch (err) {
    console.error("Failed to fetch menu items:", err);
  }
}

// Render menu items grid
function renderMenuItems(items) {
  menuItemsDiv.innerHTML = "";
  if (items.length === 0) {
    menuItemsDiv.innerHTML = "<p>No items found for this category.</p>";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>₱${item.price.toFixed(2)}</p>
    `;
    menuItemsDiv.appendChild(div);
  });
}

// Initialize
fetchCategories();
