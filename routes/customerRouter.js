const router = require("express").Router();
const customerController = require("../controllers/customerController");

router.get("/:id", customerController.read);

router.post("/register", customerController.register);

router.post("/login", customerController.login);

router.post("/cart", customerController.addToCart);

router.post("/checkout", customerController.checkout);


module.exports = router;