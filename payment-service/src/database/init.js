const db = require("./db");
const paymentModel = require("./models/payment");

module.exports = async function initDatabase() {
  db.serialize(() => {
    db.run(paymentModel.schema);
  });
};
