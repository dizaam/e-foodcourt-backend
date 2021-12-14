const jwt = require("jsonwebtoken");

exports.createToken = (username) => {
	const user = {username};
	const accessToken = jwt.sign(user, "secret", {expiresIn: '1000m'});
	const refreshToken = jwt.sign(user, "secret", {expiresIn: '60m'});

	return ({accessToken, refreshToken});
}
