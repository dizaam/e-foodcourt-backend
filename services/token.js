const jwt = require("jsonwebtoken");

exports.createToken = (identity) => {
	const user = {identity};
	const accessToken = jwt.sign(user, "secret", {expiresIn: '100m'});
	const refreshToken = jwt.sign(user, "secret", {expiresIn: '60m'});

	return ({accessToken, refreshToken});
}


