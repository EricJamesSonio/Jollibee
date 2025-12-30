const db = require("./db");
const cartItemModel = require("./models/cart_item");

module.exports = async function initDatabase() {
  db.serialize(() => {
    db.run(cartItemModel.schema);
  });
};
