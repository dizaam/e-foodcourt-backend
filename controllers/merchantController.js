const oracledb = require("oracledb");

const database = require("../services/database");
const token = require("../services/token");

exports.read = async(req, res) => {
	const id = req.params.id

	try {
		const dbResponse = await database.execute(
			`SELECT *
			FROM MERCHANT
			WHERE ID = :ID
			`, {
				id: id
			}
		);

		console.log(dbResponse.rows);

		res.status(200).json(dbResponse.rows);

	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.readAll = async(req, res) => {
	try {
		const dbResponse = await database.execute(
			`SELECT *
			FROM MERCHANT
			`
		);

		console.log(dbResponse.rows);

		res.status(200).json(dbResponse.rows);

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
	const merchant_id = req.params.id;
	const { name, email, password, m_status, phone, website } = req.body;

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
			`DELETE FROM MERCHANT
			WHERE ID = :ID
			`, {
				id: id
			}
		);
			
		return res.status(200).json("Merchant deleted");

	} catch(err) {
		return res.status(500).json({error: err.message})
	}
}