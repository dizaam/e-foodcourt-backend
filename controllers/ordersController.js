const oracledb = require("oracledb");

const database = require("../services/database");

exports.read = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_ORDERS_DETAIL(:ID);
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

exports.readCustomer = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_ORDERS_BYCUSTOMER(:ID);
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

exports.readMerchant = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_ORDERS_BYMERCHANT(:ID);
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