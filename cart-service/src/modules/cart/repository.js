const db = require("../../database/db");

module.exports = {
  addItem(item) {
    return new Promise((resolve, reject) => {
      const { menu_item_id, name, price, quantity } = item;
      db.run(
        `INSERT INTO cart_items (menu_item_id, name, price, quantity) VALUES (?, ?, ?, ?)`,
        [menu_item_id, name, price, quantity],
        function(err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, ...item });
        }
      );
    });
  },

  getItems() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM cart_items`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  removeItem(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM cart_items WHERE id = ?`, [id], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },

  clearCart() {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM cart_items`, [], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }
};
