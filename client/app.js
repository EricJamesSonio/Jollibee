const API_BASE = "http://localhost:8080";

const categoriesDiv = document.getElementById("categories");
const menuItemsDiv = document.getElementById("menu-items");
const categoryTitle = document.getElementById("category-title");

let categoriesCache = [];
let activeCategoryCode = null;
let isLoadingMenu = false;

// Fetch categories
async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/menu/categories`);
    const categories = await res.json();

    categoriesCache = categories;
    renderCategories(categories);

    // ✅ Default load only ONCE
    const defaultCategory =
      categories.find(c => c.name.toLowerCase().includes("chicken")) ||
      categories[0];

    if (defaultCategory) {
      setActiveCategory(defaultCategory.code, defaultCategory.name, true);
    }
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
}

// Render sidebar buttons
function renderCategories(categories) {
  categoriesDiv.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.name;
    btn.className = "category-btn";

    btn.onclick = () => {
      setActiveCategory(cat.code, cat.name);
    };

    categoriesDiv.appendChild(btn);
  });
}

// Handle category change
function setActiveCategory(code, name, force = false) {
  // ✅ Prevent duplicate reload
  if (!force && activeCategoryCode === code) return;

  activeCategoryCode = code;
  categoryTitle.textContent = name;

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.classList.toggle("active", btn.textContent === name);
  });

  fetchMenuItems(code);
}

// Fetch menu items
async function fetchMenuItems(categoryCode) {
  if (isLoadingMenu) return;

  isLoadingMenu = true;
  menuItemsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(
      `${API_BASE}/menu/menu-items?category=${categoryCode}`
    );
    const items = await res.json();
    renderMenuItems(items);
  } catch (err) {
    console.error("Failed to fetch menu items:", err);
  } finally {
    isLoadingMenu = false;
  }
}

// Render menu grid
function renderMenuItems(items) {
  menuItemsDiv.innerHTML = "";

  if (!items.length) {
    menuItemsDiv.innerHTML = "<p>No items available.</p>";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";

    div.innerHTML = `
      <img 
        src="${API_BASE}${item.image_url}" 
        alt="${item.name}"
        class="menu-item-img"
        loading="lazy"
        onerror="this.src='${API_BASE}/images/placeholder.png'"
      />
      <h3>${item.name}</h3>
      <p>₱${item.price.toFixed(2)}</p>
    `;

    menuItemsDiv.appendChild(div);
  });
}

// Init
fetchCategories();
