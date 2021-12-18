const oracledb = require("oracledb");

const database = require("../services/database");

exports.readAll = async(req, res) => {

	try {
		const dbResponse = await database.execute(
			`SELECT * 
			FROM INVOICE
			`
		);

		console.log(dbResponse.rows);

		res.status(200).json(dbResponse.rows);

	} catch(err) {
		res.status(500).json({message: err.message});
	}

}

exports.readCustomer = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`SELECT *
			FROM INVOICE
			WHERE CUSTOMER_ID = :ID
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