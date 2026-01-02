import { getCart, removeCartItem } from "../services/cart.js";
import { computeCart } from "../state/cart.js";
import { API_BASE } from "../config/api.js";
import { refreshCartSummary } from "./cart-summary.js";

const drawer = document.getElementById("cart-drawer");
const itemsDiv = document.getElementById("cart-drawer-items");
const totalEl = document.getElementById("drawer-total");
const closeBtn = document.getElementById("cart-drawer-close");

export function openCartDrawer() {
  drawer.classList.remove("hidden");
  renderCartDrawer();
}

export function closeCartDrawer() {
  drawer.classList.add("hidden");
}

closeBtn.onclick = closeCartDrawer;

async function renderCartDrawer() {
  const cart = await getCart();
  const { total } = computeCart(cart);

  itemsDiv.innerHTML = "";

  if (!cart.items.length) {
    itemsDiv.innerHTML = "<p>Your cart is empty.</p>";
  }

  cart.items.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${API_BASE}${item.image_url || "/images/placeholder.png"}" />
      <div class="cart-item-info">
        <p><strong>${item.name}</strong></p>
        <p>₱${item.price.toFixed(2)} × ${item.quantity}</p>
      </div>
      <button class="cart-item-remove">✕</button>
    `;

    div.querySelector(".cart-item-remove").onclick = async () => {
      await removeCartItem(item.id);
      await refreshCartSummary();
      renderCartDrawer();
    };

    itemsDiv.appendChild(div);
  });

  totalEl.textContent = `₱${total.toFixed(2)}`;
}
