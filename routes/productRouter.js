const router = require("express").Router();

const productController = require("../controllers/productController");

router.get("/all", productController.readAllAvailableProduct);

router.get("/merchant/:id", productController.readMerchantProduct);

router.get("/:id", productController.readProduct);

router.post("/create", productController.createProduct);

router.put("/update/:id", productController.updateProduct);

router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;