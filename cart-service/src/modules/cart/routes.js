const express = require("express");
const service = require("./service");

const router = express.Router();

router.post("/cart/add", async (req, res, next) => {
  try {
    const item = await service.addItem(req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.put("/cart/item/:id", async (req, res, next) => {
  try {
    const { quantity } = req.body;
    await service.updateItemQuantity(req.params.id, quantity);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});


router.get("/cart", async (req, res, next) => {
  try {
    const cart = await service.getCart();
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.delete("/cart/item/:id", async (req, res, next) => {
  try {
    const removed = await service.removeItem(req.params.id);
    res.json({ removed });
  } catch (err) {
    next(err);
  }
});

router.post("/cart/checkout", async (req, res, next) => {
  try {
    const cart = await service.checkout();
    res.json({ message: "Checkout successful", cart });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
