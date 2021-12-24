const router = require('express').Router();

const merchantController = require("../controllers/merchantController");
const authorizeToken = require("../middleware/authorizeToken");

// post login 
router.get('/login', async(req, res) => {
	res.render("../views/admin.ejs");
})


router.get("/all", merchantController.readAll);

router.get("/:id", merchantController.read);

router.post('/login', merchantController.login);

router.post("/register", merchantController.register);

router.put("/update/:id", merchantController.update)

router.delete("/:id", merchantController.delete);


module.exports = router;