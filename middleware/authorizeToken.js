const jwt = require("jsonwebtoken");

exports.authorizeToken = (req, res, next) => {
	// bearer TOKEN
	const authHeader = req.headers['authorization'];

	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		return res.status(401).json({error: "Null Token"});
	}

	jwt.verify(token, "secret", (error, user) => {
		if (error) {
			return res.status(403).json({error: error.message});
		}

		req.user = user;
		next();
	})
}