const db = require("./db");

const models = [
  require("./models/category"),
  require("./models/menu_item")
];

const categorySeeds = require("./seeds/category");
const menuItemSeeds = require("./seeds/menu_item");

module.exports = async function initDatabase() {
  db.serialize(() => {
    // create tables
    models.forEach((model) => {
      db.run(model.schema);
    });

    // seed categories
    categorySeeds.forEach((c) => {
      db.run(
        "INSERT OR IGNORE INTO categories (code, name) VALUES (?, ?)",
        [c.code, c.name]
      );
    });

    // seed menu items
    menuItemSeeds.forEach((m) => {
      db.run(
        "INSERT INTO menu_items (name, price, category_code) VALUES (?, ?, ?)",
        [m.name, m.price, m.category_code]
      );
    });
  });
};
