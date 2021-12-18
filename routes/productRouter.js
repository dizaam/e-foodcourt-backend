const router = require("express").Router();

const productController = require("../controllers/productController");

router.get("/all", productController.readAllAvailable);

router.get("/category", productController.readCategory);

router.get("/merchant/:id", productController.readMerchant);

router.get("/:id", productController.read);

router.post("/create", productController.create);

router.put("/update/:id", productController.update);

router.delete("/delete/:id", productController.delete);


module.exports = router;