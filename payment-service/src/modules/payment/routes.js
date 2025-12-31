const express = require("express");
const service = require("./service");

const router = express.Router();

router.post("/payments/pay", async (req, res, next) => {
  try {
    const { order_id, amount_paid } = req.body;
    const payment = await service.processPayment(order_id, amount_paid);
    res.json(payment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
