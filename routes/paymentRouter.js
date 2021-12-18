const router = require("express").Router();

const paymentController = require("../controllers/paymentController");

router.get("/all", paymentController.readAll);

router.get("/available", paymentController.readAvailable);

router.post("/add", paymentController.create);

router.put("/update/:id", paymentController.update);

router.delete("/delete/:id", paymentController.delete);

module.exports = router;