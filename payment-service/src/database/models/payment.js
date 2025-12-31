module.exports = {
  name: "payments",
  schema: `
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      total REAL,
      amount_paid REAL,
      change REAL,
      paid_at TEXT
    )
  `
};
