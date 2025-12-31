const db = require("../../database/db");

module.exports = {
  // Save payment record
  savePayment(payment) {
    return new Promise((resolve, reject) => {
      const { order_id, total, amount_paid, change } = payment;
      const paidAt = new Date().toISOString();

      db.run(
        `INSERT INTO payments (order_id, total, amount_paid, change, paid_at)
         VALUES (?, ?, ?, ?, ?)`,
        [order_id, total, amount_paid, change, paidAt],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, ...payment, paid_at: paidAt });
        }
      );
    });
  },

  // Pending orders
  savePendingOrder(order) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO pending_orders (order_id, total)
         VALUES (?, ?)`,
        [order.id, order.total],
        (err) => (err ? reject(err) : resolve())
      );
    });
  },

  getPendingOrder(orderId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM pending_orders WHERE order_id = ?`,
        [orderId],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });
  },

  deletePendingOrder(orderId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM pending_orders WHERE order_id = ?`,
        [orderId],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }
};
