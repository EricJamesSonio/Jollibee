import { API } from "../config/api.js";

export async function addToCart(item) {
  const res = await fetch(`${API.cart.base()}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!res.ok) throw new Error("Failed to add item to cart");
  return res.json();
}

export async function getCart() {
  const res = await fetch(`${API.cart.base()}/cart`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function removeCartItem(id) {
  const res = await fetch(`${API.cart.base()}/cart/item/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to remove item");
}
