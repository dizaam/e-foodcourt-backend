const jwt = require("jsonwebtoken");

function createToken (username) {
	const user = {username};
	const accessToken = jwt.sign(user, "secret", {expiresIn: '100m'});
	const refreshToken = jwt.sign(user, "secret", {expiresIn: '60m'});

	return ({accessToken, refreshToken});
}

module.exports = createToken;

