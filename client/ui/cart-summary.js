import { getCart } from "../services/cart.js";
import { cartState, computeCart } from "../state/cart.js";
import { openCartDrawer } from "./cart-drawer.js";


let countEl;
let totalEl;

export function initCartSummary() {
  countEl = document.getElementById("cart-count");
  totalEl = document.getElementById("cart-total");

  refreshCartSummary();
}

export async function refreshCartSummary() {
  const cart = await getCart();

  cartState.items = cart.items;
  cartState.total = cart.total;

  const { count, total } = computeCart(cart);

  countEl.textContent = count;
  totalEl.textContent = `₱${total.toFixed(2)}`;
}

document
  .querySelector(".cart-summary")
  .addEventListener("click", openCartDrawer);
