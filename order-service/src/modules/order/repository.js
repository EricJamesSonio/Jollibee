const db = require("../../database/db");

module.exports = {
  createOrder(order) {
    return new Promise((resolve, reject) => {
      const { total, status, items } = order;
      const createdAt = new Date().toISOString();

      db.run(
        `INSERT INTO orders (status, total, created_at)
         VALUES (?, ?, ?)`,
        [status, total, createdAt],
        function (err) {
          if (err) return reject(err);

          const orderId = this.lastID;
          const stmt = db.prepare(
            `INSERT INTO order_items
             (order_id, menu_item_id, name, price, quantity)
             VALUES (?, ?, ?, ?, ?)`
          );

          for (const item of items) {
            stmt.run(
              orderId,
              item.menu_item_id,
              item.name,
              item.price,
              item.quantity
            );
          }

          stmt.finalize();
          resolve({
            id: orderId,
            status,
            total,
            created_at: createdAt
          });
        }
      );
    });
  },

  getPendingOrders() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM orders
         WHERE status IN ('PENDING', 'PAID')
         ORDER BY created_at ASC`,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },

  // 🔥 NEW — triggered by PAYMENT_CONFIRMED
  markOrderPaid(orderId) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE orders SET status = 'PAID' WHERE id = ?`,
        [orderId],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  markOrderComplete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE orders SET status = 'COMPLETED' WHERE id = ?`,
        [id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }
};
