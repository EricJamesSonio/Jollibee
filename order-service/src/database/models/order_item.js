module.exports = {
  name: "order_items",
  schema: `
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      menu_item_id INTEGER,
      name TEXT,
      price REAL,
      quantity INTEGER
    )
  `
};
