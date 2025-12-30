const express = require("express");
const menuRoutes = require("../modules/menu/routes");

const router = express.Router();
router.use(menuRoutes);

module.exports = { routes: router };
