import { API } from "../config/api.js";

export async function fetchPendingOrders() {
  const res = await fetch(API.orders.pending());
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function markOrderComplete(id) {
  const res = await fetch(API.orders.complete(id), {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to mark order as completed");
  return res.json();
}
