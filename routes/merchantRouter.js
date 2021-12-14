const router = require('express').Router();

const merchantController = require("../controllers/merchantController");
const authorizeToken = require("../middleware/authorizeToken");

// post login 
router.get('/', async(req, res) => {
	res.render("../views/admin.ejs");
})

router.post('/', merchantController.authenticate);

router.get('/dashboard', async(req, res) => {

});

module.exports = router;