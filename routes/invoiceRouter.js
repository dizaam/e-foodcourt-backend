const router = require("express").Router();

const invoiceController = require("../controllers/invoiceController");

router.get("/all", invoiceController.readAll);

router.get("/customer/:id", invoiceController.readCustomer);

module.exports = router;