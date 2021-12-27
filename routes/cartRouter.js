const router = require("express").Router();
const cartController = require("../controllers/cartController");

router.get("/:id", cartController.read);

router.get("/:id/detail", cartController.readDetail);

router.put("/update", cartController.update);

router.delete("/delete", cartController.delete);

module.exports = router;