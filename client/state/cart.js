export const cartState = {
  items: [],
  total: 0,
};

export function computeCart(cart) {
  const items = cart.items || [];
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    count: items.reduce((sum, i) => sum + i.quantity, 0),
    total,
  };
}
