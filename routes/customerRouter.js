const router = require("express").Router();
const customerController = require("../controllers/customerController");

router.post("/register", customerController.register);

router.post("/login", customerController.login);

module.exports = router;