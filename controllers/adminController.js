const database = require("../services/database");
const token = require("../services/token");

exports.login = async(req, res) => {
	const { username, password } = req.body;

	try {
		const dbResponse = await database.execute(
			`SELECT *
			FROM ADMIN
			WHERE USERNAME = :username AND PASSWORD = :password
			`, {
				username: username,
				password: password
			}
		);

		const status = dbResponse.rows;

		if (status.length === 0) {
			console.log("Login Gagal");

			return res.status(403).json({message: "Username/email and password combination doesnt match"});
		} else {
			console.log("Login Berhasil");

			const result = {
				id: status.id,
				token: token.createToken(status.id)
			}

			res.cookie('refreshToken', result.token.refreshToken, {httpOnly: true});

			return res.status(200).json(result);
		}
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}