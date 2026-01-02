const repository = require("./repository");
const { sendCartCheckout } = require("../../kafka/producer");

module.exports = {
  async addItem(item) {
    return repository.addItem({
      menu_item_id: item.menu_item_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url
    });
  },

  async getCart() {
    const items = await repository.getItems();
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return { items, total };
  },

  async removeItem(id) {
    return repository.removeItem(id);
  },

  async updateItemQuantity(id, quantity) {
    if (quantity <= 0) return repository.removeItem(id);
    return repository.updateQuantity(id, quantity);
  },

  async checkout() {
    const cart = await this.getCart();
    if (!cart.items.length) throw new Error("Cart is empty");

    await sendCartCheckout(cart); 
    await repository.clearCart();   
    return cart;
  },

  async clearCart() {
    return repository.clearCart();
  }
};
