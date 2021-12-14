const { dbExecute } = require("../services/database");
const createToken = require("../services/createToken");

exports.authenticate = async(req, res) => {
	let { username, password } = req.body;
	console.log(req.body);

	try {
		const status = await dbExecute(
		`
			SELECT *
			FROM MERCHANT M
			WHERE M.username = '${username}' AND M.password = '${password}'
		`);

		// console.log(status.rows.length);
		if (!status.rows.length) {
			console.log("Login Gagal");

			return res.status(401).json("Gagal");
		} else {
			console.log("Login Berhasil");
			
			let tokens = createToken(status.rows[0].USERNAME);

			res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true});
			res.json(tokens);

			return res.status(200).json("Succes");
		}
	}catch (err) {
		res.status(401).json({error: error.message});
	}
}