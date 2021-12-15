const router = require('express').Router();

const merchantController = require("../controllers/merchantController");
const authorizeToken = require("../middleware/authorizeToken");

// post login 
router.get('/login', async(req, res) => {
	res.render("../views/admin.ejs");
})

router.post('/login', merchantController.authenticate);

// router.get('/product', authorizeToken, );

module.exports = router;