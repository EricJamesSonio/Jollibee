const express = require("express");
const service = require("./service");

const router = express.Router();

router.get("/orders/pending", async (req, res, next) => {
  try {
    const orders = await service.getPendingOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.put("/orders/:id/complete", async (req, res, next) => {
  try {
    await service.completeOrder(req.params.id);
    res.json({ message: "Order marked as completed" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
