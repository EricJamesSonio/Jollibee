import { API_BASE } from "../config/api.js";
import { openCartModal } from "./cart-modal.js";
import { qs, clear } from "../utils/dom.js";

const menuItemsDiv = qs("#menu-items");

export function renderMenuItems(items) {
  clear(menuItemsDiv);

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";

    div.innerHTML = `
      <img src="${API_BASE}${item.image_url}" class="menu-item-img" />
      <h3>${item.name}</h3>
      <p>₱${item.price.toFixed(2)}</p>
    `;

    div.onclick = () => openCartModal(item);

    menuItemsDiv.appendChild(div);
  });
}
