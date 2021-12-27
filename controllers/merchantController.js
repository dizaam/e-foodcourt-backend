const oracledb = require("oracledb");

const database = require("../services/database");
const token = require("../services/token");

exports.read = async(req, res) => {
	const id = req.params.id

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_A_MERCHANT(:id);
			END;`, {
				id: id
			}
		);

		console.log(dbResponse.implicitResults[0]);

		res.status(200).json(dbResponse.implicitResults[0]);

	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.readAll = async(req, res) => {
	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_ALL_MERCHANT();
			END;`
		);

		console.log(dbResponse.implicitResults[0]);

		res.status(200).json(dbResponse.implicitResults[0]);

	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.login = async(req, res) => {
	const { email, password } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := AUTHENTICATE_MERCHANT(:email, :password, :id);
			END;`,{
				email: email,
				password: password,
				id: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER},
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.flag === 1) {
			console.log("Login Gagal");

			return res.status(403).json({message: "Username/email and password combination doesnt match or account is being used"});
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
	}
}

exports.logout = async(req, res) => {
	const merchant_id = req.params.id;

	try {
		await database.execute(
			`BEGIN
				LOGOUT_MERCHANT(:merchant_id);
			END;`, {
				merchant_id: merchant_id
			}
		);

		console.log("LOGOUT SUCCESS");
		res.status(200).json({message: "LOGOUT SUCCESS"});
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}



exports.register = async(req, res) => {
	const {name, email, password, phone, website} = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := CREATE_MERCHANT(:name, :email, :password, :phone, :website);
			END;`,{
				name: name,
				email: email,
				password: password,
				phone: phone, 
				website: website,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.flag === 0) {
			return res.status(200).json("Register succes");
		} else if (status.flag === 1) {
			return res.status(403).json("Please choose different name");
		} else {
			return res.status(500).json("Server Error");
		}

	} catch(err) {
		return res.status(500).json({error: err.message})
	}
}

exports.update = async(req, res) => {
	const { merchant_id, name, email, password, m_status, phone, website } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := UPDATE_MERCHANT(:merchant_id, :name, :email, :password, :status, :phone, :website);
			END;`,{
				merchant_id: merchant_id,
				name: name,
				email: email,
				password: password,
				status: m_status,
				phone: phone, 
				website: website,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.flag === 0) {
			return res.status(200).json("Merchant updated");
		} else if (status.flag === 1) {
			return res.status(403).json("Please choose different name");
		} else {
			return res.status(500).json("Server Error");
		}

	} catch(err) {
		return res.status(500).json({error: err.message})
	}

}

exports.delete = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := DELETE_A_MERCHANT(:id);
			END;`, {
				id: id,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
			}
		);

		const result = dbResponse.outBinds.flag;
		console.log(result);

		if (result) {
			return res.status(200).json("Merchant deleted");
		} else {
			return res.status(400).json("Merchant not found");
		}
	} catch(err) {
		return res.status(500).json({error: err.message})
	}
}