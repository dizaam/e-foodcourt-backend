const router = require("express").Router();

const adminController = require("../controllers/adminController");

router.post("/login", adminController.login);

router.put("/logout", adminController.logout);

module.exports = router;