module.exports = {
  name: "pending_orders",
  schema: `
    CREATE TABLE IF NOT EXISTS pending_orders (
      order_id INTEGER PRIMARY KEY,
      total REAL
    )
  `
};
