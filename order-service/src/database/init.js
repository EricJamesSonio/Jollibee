const db = require("./db");
const orderModel = require("./models/order");
const orderItemModel = require("./models/order_item");

module.exports = async function initDatabase() {
  db.serialize(() => {
    db.run(orderModel.schema);
    db.run(orderItemModel.schema);
  });
};
