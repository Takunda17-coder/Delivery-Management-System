const express = require("express");
const router = express.Router();
const driversController = require("../controller/drivers.controller");

router.post("/", driversController.createDriver);
router.get("/", driversController.getAllDrivers);
router.get("/user/:user_id", driversController.getDriverByUserId);
router.get("/:id", driversController.getDriverById);
router.put("/:id", driversController.updateDriver);
router.delete("/:id", driversController.deleteDriver);

module.exports = router;
