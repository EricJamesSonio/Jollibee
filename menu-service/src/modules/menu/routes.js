const express = require("express");
const service = require("./service");

const router = express.Router();

router.get("/categories", async (req, res, next) => {
  try {
    const categories = await service.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

router.get("/menu-items", async (req, res, next) => {
  try {
    const items = await service.getMenuItems(req.query.category);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
