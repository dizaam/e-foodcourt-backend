const oracledb = require("oracledb");

const database = require("../services/database");
const token = require("../services/token");

exports.register = async(req, res) => {
	const {email, username, password, phone} = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:response := CREATE_NEW_CUSTOMER(:email, :username, :password, :phone);
			END;`,{
				email: email,
				username: username,
				password: password,
				phone: phone, 
				response: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.response === 0) {
			return res.status(200).json("Register succes");
		} else if (status.response === 1) {
			return res.status(403).json("Please choose different email/username/phone");
		} else {
			return res.status(500).json("Server Error");
		}

	} catch(err) {
		return res.status(500).json({error: err.message})
	}
}

exports.login = async(req, res) => {
	const { unamemail, password } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:response := AUTHENTICATE_CUSTOMER(:unamemail, :password, :id);
			END;`,{
				unamemail: unamemail,
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


