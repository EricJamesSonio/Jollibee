const db = require("../../database/db");

module.exports = {
  getCategories() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  getMenuByCategory(categoryCode) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM menu_items WHERE category_code = ?",
        [categoryCode],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
};
