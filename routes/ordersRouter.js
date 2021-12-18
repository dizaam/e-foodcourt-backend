const router = require("express").Router();

const ordersController = require("../controllers/ordersController");

router.get("/:id", ordersController.read);

router.get("/customer/:id", ordersController.readCustomer);

router.get("/merchant/:id", ordersController.readMerchant);

module.exports = router;