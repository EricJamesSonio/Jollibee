const db = require("../../database/db");

module.exports = {
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
  }
};
