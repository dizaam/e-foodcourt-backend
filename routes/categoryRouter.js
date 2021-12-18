const router = require("express").Router();

const categoryController = require("../controllers/categoryController");

router.get("/all", categoryController.readAll);

router.post("/create", categoryController.create);

module.exports = router;
