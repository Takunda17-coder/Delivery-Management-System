const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/stats", adminController.getAdminStats);
router.get("/orders-trend", adminController.getOrdersTrend);

module.exports = router;
