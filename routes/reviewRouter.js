const router = require("express").Router();

const reviewController = require("../controllers/reviewController");


router.post("/create", reviewController.create);

router.get("/product/:id", reviewController.readByProduct);

router.get("/customer/:id", reviewController.readByCustomer);

module.exports = router;