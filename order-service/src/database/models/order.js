module.exports = {
  name: "orders",
  schema: `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT,
      total REAL,
      created_at TEXT
    )
  `
};
