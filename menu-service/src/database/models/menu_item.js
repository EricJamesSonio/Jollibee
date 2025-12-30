module.exports = {
  name: "menu_items",
  schema: `
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL,
      category_code TEXT
    )
  `
};
