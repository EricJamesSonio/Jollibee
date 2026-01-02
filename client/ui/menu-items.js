import { API_BASE } from "../config/api.js";
import { qs, clear } from "../utils/dom.js";

const menuItemsDiv = qs("#menu-items");

export function renderMenuItems(items) {
  clear(menuItemsDiv);

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
