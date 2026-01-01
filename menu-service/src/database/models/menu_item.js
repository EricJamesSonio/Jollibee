module.exports = {
  name: "menu_items",
  schema: `
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category_code TEXT NOT NULL,
      image_url TEXT
    )
  `
};
