const repository = require("./repository");
const { sendPaymentConfirmed } = require("../../kafka/producer");

module.exports = {
  /**
   * Called by Kafka consumer when ORDER_CREATED is received
   */
  async cacheOrder(order) {
    await repository.savePendingOrder(order);
  },

  /**
   * Called by API route to process payment
   */
  async processPayment(orderId, amountPaid) {
    const order = await repository.getPendingOrder(Number(orderId));
    if (!order) {
      throw new Error("Order not found or already paid");
    }

    if (amountPaid < order.total) {
      throw new Error("Insufficient payment");
    }

    const change = amountPaid - order.total;

    const payment = await repository.savePayment({
      order_id: order.order_id,
      total: order.total,
      amount_paid: amountPaid,
      change
    });

    await sendPaymentConfirmed({
      order_id: order.order_id,
      payment_id: payment.id
    });

    await repository.deletePendingOrder(order.order_id);

    return payment;
  }
};
