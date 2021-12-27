const router = require("express").Router();
const customerController = require("../controllers/customerController");


router.get("/all", customerController.readAll);

router.get("/:id", customerController.read);

router.delete("/delete/:id", customerController.delete);

router.put("/update", customerController.update);

router.post("/register", customerController.register);

router.post("/login", customerController.login);

router.put("/logout/:id", customerController.logout);

router.post("/cart", customerController.addToCart);

router.post("/checkout", customerController.checkout);


module.exports = router;