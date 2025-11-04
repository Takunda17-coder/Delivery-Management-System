const express = require("express");
const router = express.Router();
const customersController = require("../controller/customers.controller");

router.post("/", customersController.createCustomer);
router.get("/", customersController.getAllCustomers);
router.get("/:id", customersController.getCustomerById);
router.get("/user/:userId", customersController.getCustomerByUserId);
router.put("/:id", customersController.updateCustomer);
router.delete("/:id", customersController.deleteCustomer);

module.exports = router;

