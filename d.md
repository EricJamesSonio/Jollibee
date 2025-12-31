i just want you to create me a simple documentation on how they work  , liek the flow of it since we fixed it from menu service - cart service- order service - payment service right? give me a flow md for that so that we can create the client side just simple kiosk jollibee ! so to give u some info, here is the the menu serivce repo const db = require("../../database/db");

module.exports = {
  getCategories() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  getMenuByCategory(categoryCode) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM menu_items WHERE category_code = ?",
        [categoryCode],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
};  and service  here producer of cart const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "cart-service",
  brokers: ["localhost:9092"] // adjust if dockerized
});

const producer = kafka.producer();

async function sendCartCheckout(cart) {
  await producer.connect();
  await producer.send({
    topic: "CART_CHECKOUT",
    messages: [{ value: JSON.stringify(cart) }]
  });
  await producer.disconnect();
}

module.exports = { sendCartCheckout };  rep oconst db = require("../../database/db");

module.exports = {
  addItem(item) {
    return new Promise((resolve, reject) => {
      const { menu_item_id, name, price, quantity } = item;
      db.run(
        `INSERT INTO cart_items (menu_item_id, name, price, quantity) VALUES (?, ?, ?, ?)`,
        [menu_item_id, name, price, quantity],
        function(err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, ...item });
        }
      );
    });
  },

  getItems() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM cart_items`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  removeItem(id) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM cart_items WHERE id = ?`, [id], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },

  clearCart() {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM cart_items`, [], function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }
};   and service const repository = require("./repository");
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
};  here is the order service const { Kafka } = require("kafkajs");
const orderService = require("../modules/order/service");

const kafka = new Kafka({
  clientId: "order-service-consumer",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "order-service-group" });

async function runConsumer() {
  await consumer.connect();

  await consumer.subscribe({ topic: "CART_CHECKOUT", fromBeginning: false });
  await consumer.subscribe({ topic: "PAYMENT_CONFIRMED", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = JSON.parse(message.value.toString());

      switch (topic) {
        case "CART_CHECKOUT":
          await orderService.createOrderFromCart(payload);
          break;

        case "PAYMENT_CONFIRMED":
          await orderService.handlePaymentConfirmed(payload);
          break;

        default:
          console.warn("Unhandled topic:", topic);
      }
    }
  });
}

module.exports = { runConsumer };  consumer and here is producer const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer();

async function sendPaymentConfirmed(payment) {
  await producer.connect();
  await producer.send({
    topic: "PAYMENT_CONFIRMED",
    messages: [{ value: JSON.stringify(payment) }]
  });
  await producer.disconnect();
}

module.exports = { sendPaymentConfirmed };  repo const db = require("../../database/db");

module.exports = {
  createOrder(order) {
    return new Promise((resolve, reject) => {
      const { total, status, items } = order;
      const createdAt = new Date().toISOString();

      db.run(
        `INSERT INTO orders (status, total, created_at)
         VALUES (?, ?, ?)`,
        [status, total, createdAt],
        function (err) {
          if (err) return reject(err);

          const orderId = this.lastID;
          const stmt = db.prepare(
            `INSERT INTO order_items
             (order_id, menu_item_id, name, price, quantity)
             VALUES (?, ?, ?, ?, ?)`
          );

          for (const item of items) {
            stmt.run(
              orderId,
              item.menu_item_id,
              item.name,
              item.price,
              item.quantity
            );
          }

          stmt.finalize();
          resolve({
            id: orderId,
            status,
            total,
            created_at: createdAt
          });
        }
      );
    });
  },

  getPendingOrders() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM orders
         WHERE status IN ('PENDING', 'PAID')
         ORDER BY created_at ASC`,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },

  // 🔥 NEW — triggered by PAYMENT_CONFIRMED
  markOrderPaid(orderId) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE orders SET status = 'PAID' WHERE id = ?`,
        [orderId],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  markOrderComplete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE orders SET status = 'COMPLETED' WHERE id = ?`,
        [id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }
};  and service const repository = require("./repository");
const { sendOrderCreated } = require("../../kafka/producer");

module.exports = {
  async createOrderFromCart(cart) {
    const order = {
      status: "PENDING",
      total: cart.total,
      items: cart.items
    };

    const savedOrder = await repository.createOrder(order);

    // 🔥 emit event
    await sendOrderCreated(savedOrder);

    return savedOrder;
  },

  async getPendingOrders() {
    return repository.getPendingOrders();
  },

  async completeOrder(id) {
    return repository.markOrderComplete(id);
  },

  // 🔥 NEW — Kafka consumer entry
  async handlePaymentConfirmed(event) {
    const { order_id } = event;
    if (!order_id) throw new Error("order_id missing in PAYMENT_CONFIRMED");

    return repository.markOrderPaid(order_id);
  }
}; and here payment service consuemr const { Kafka } = require("kafkajs");
const paymentService = require("../modules/payment/service");

const kafka = new Kafka({
  clientId: "payment-service-consumer",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "payment-group" });

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "ORDER_CREATED", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      await paymentService.cacheOrder(order);
    }
  });
}

module.exports = { runConsumer };   and producer   and repo const db = require("../../database/db");

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
};   and service const repository = require("./repository");
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
    if (!order) throw new Error("Order not found or already paid");

    if (amountPaid < order.total) throw new Error("Insufficient payment");

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