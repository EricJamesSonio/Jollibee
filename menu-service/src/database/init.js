const db = require("./db");

const models = [
  require("./models/category"),
  require("./models/menu_item")
];

const categorySeeds = require("./seeds/category");
const menuItemSeeds = require("./seeds/menu_item");

module.exports = async function initDatabase() {
  db.serialize(() => {
    // 1️⃣ Create tables
    models.forEach((model) => {
      db.run(model.schema);
    });

    // 2️⃣ Seed categories (safe)
    categorySeeds.forEach((c) => {
      db.run(
        "INSERT OR IGNORE INTO categories (code, name) VALUES (?, ?)",
        [c.code, c.name]
      );
    });

    // 3️⃣ Seed menu items ONLY if empty (IMPORTANT)
    db.get("SELECT COUNT(*) AS count FROM menu_items", (err, row) => {
      if (err) {
        console.error("Failed to check menu_items:", err);
        return;
      }

      if (row.count === 0) {
        menuItemSeeds.forEach((m) => {
          db.run(
            `INSERT INTO menu_items 
             (name, price, category_code, image_url)
             VALUES (?, ?, ?, ?)`,
            [m.name, m.price, m.category_code, m.image_url]
          );
        });

        console.log("✅ Menu items seeded");
      }
    });
  });
};
