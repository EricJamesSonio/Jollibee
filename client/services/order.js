import { API } from "../config/api.js";

export async function checkout(cart) {
  const res = await fetch(API.orders.create(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  });

  if (!res.ok) {
    throw new Error("Checkout failed");
  }

  return res.json();
}
