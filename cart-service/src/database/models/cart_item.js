module.exports = {
  name: "cart_items",
  schema: `
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_item_id INTEGER,
      name TEXT,
      price REAL,
      quantity INTEGER,
      image_url TEXT 
    )
  `
};
