const oracledb = require("oracledb");

const database = require("../services/database");
const token = require("../services/token");

exports.authenticate = async(req, res) => {
	const { username, password } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:response := AUTHENTICATE_MERCHANT(:username, :password, :id);
			END;`,{
				username: username,
				password: password,
				id: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER},
				response: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.response === 1) {
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
	}catch (err) {
		res.status(500).json({error: err.message});
		throw(err);
	}
}

exports.getAllProduct = async(req, res) => {

}