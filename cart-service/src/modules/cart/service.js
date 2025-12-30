const repository = require("./repository");
const { sendCartCheckout } = require("../../kafka/producer");

module.exports = {
  async addItem(item) {
    return repository.addItem(item);
  },

  async getCart() {
    const items = await repository.getItems();
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return { items, total };
  },

  async removeItem(id) {
    return repository.removeItem(id);
  },

  async checkout() {
    const cart = await this.getCart();
    if (cart.items.length === 0) throw new Error("Cart is empty");
    
    await sendCartCheckout(cart);   // send event to Kafka
    await repository.clearCart();   // clear cart after checkout
    return cart;
  }
};
