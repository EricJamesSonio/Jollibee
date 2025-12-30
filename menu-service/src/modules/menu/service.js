const repository = require("./repository");

module.exports = {
  async getCategories() {
    return repository.getCategories();
  },

  async getMenuItems(categoryCode) {
    if (!categoryCode) throw new Error("Category code is required");
    return repository.getMenuByCategory(categoryCode);
  }
};
