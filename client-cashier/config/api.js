export const API_BASE = "http://localhost:8080";

export const API = {
  orders: {
    base: () => `${API_BASE}/orders/orders`,        // for creating new orders
    pending: () => `${API_BASE}/orders/pending`,    // fetch all pending orders
    complete: (id) => `${API_BASE}/orders/${id}/complete`, // mark order completed
  },
  payments: {
    pay: () => `${API_BASE}/payments/pay`           // process payment
  }
};
