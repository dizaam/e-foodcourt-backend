const oracledb = require("oracledb");
const database = require("../services/database");

exports.readAll = async(req, res) => {
	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_ALL_PAYMENT();
			END;`
		);

		console.log(dbResponse.implicitResults[0]);

		res.status(200).json(dbResponse.implicitResults[0]);
	} catch(err) {
		res.status(500).json({message: err.message});
	}

}

exports.readAvailable = async(req, res) => {
	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_AVAILABLE_PAYMENT();
			END;`
		);

		console.log(dbResponse.implicitResults[0]);

		res.status(200).json(dbResponse.implicitResults[0]);
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.create = async(req, res) => {
	const { method, number, status_p} = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := CREATE_PAYMENT(:method, :number, :status_p);
			END;`,{
				method: method,
				number: number,
				status_p: status_p,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.flag === 1) {
			console.log("You can only add unique payment method");

			return res.status(403).json({message: "Failed, You can only add unique payment method"});
		} else {
			console.log("New Payment Method added");

			return res.status(200).json({message: "Succesfully added payment method"});
		}
	}catch (err) {
		res.status(500).json({error: err.message});
		throw(err);
	}
}

exports.delete = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := DELETE_A_PAYMENT(:ID);
			END;`, {
				id: id,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
			}
		);

		const result = dbResponse.outBinds.flag;
		
		console.log(result);

		if (result) {
			return res.status(200).json("Payment deleted");
		} else {
			return res.status(400).json("Payment not found");
		}
	} catch(err) {
		return res.status(500).json({error: err.message})
	}

}

exports.update = async(req, res) => {
	const id = req.params.id;
	const { method, number, status_p} = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := UPDATE_PAYMENT(:id, :method, :number, :status);
			END;`,{
				id: id,
				method: method,
				number: number,
				status: status_p,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.flag === 1) {
			console.log("You can only add unique payment method");

			return res.status(403).json({message: "Failed, You can only add unique payment method"});
		} else {
			console.log("New Payment Method added");

			return res.status(200).json({message: "Succesfully update payment method"});
		}
	}catch (err) {
		res.status(500).json({error: err.message});
		throw(err);
	}
}