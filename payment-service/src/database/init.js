const db = require("./db");

const models = [
  require("./models/payment"),
  require("./models/pending_order") // 🔥 add this
];

module.exports = async function initDatabase() {
  db.serialize(() => {
    models.forEach((model) => {
      db.run(model.schema);
    });
  });
};
