const oracledb = require("oracledb");
const database = require("../services/database");
const token = require("../services/token");

exports.login = async(req, res) => {
	const { username, password } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := AUTHENTICATE_ADMIN(:username, :password);
			END;`, {
				username: username,
				password: password,
				flag: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds.flag;

		if (status !== 0) {
			console.log("Login Gagal");

			return res.status(403).json({message: "Username/email and password combination doesnt match"});
		} else {
			console.log("Login Berhasil");

			const result = {
				username: username,
				token: token.createToken(status.id)
			}

			res.cookie('refreshToken', result.token.refreshToken, {httpOnly: true});

			return res.status(200).json(result);
		}
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.logout = async(req, res) => {
	const username = req.params.username;

	try {
		await database.execute(
			`BEGIN
				LOGOUT_ADMIN(:username);
			END;`, {
				username: username
			}
		);

		console.log("LOGOUT SUCCESS");
		res.status(200).json({message: "LOGOUT SUCCESS"});
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}
