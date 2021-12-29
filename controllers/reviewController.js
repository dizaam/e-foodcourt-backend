const oracledb = require("oracledb");
const database = require("../services/database");


exports.create = async(req, res) => {
	const { product_id, customer_id, rating, note } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := CREATE_REVIEW(:RATING, :NOTE, :CUSTOMER_ID, :PRODUCT_ID);
			END;`, {
				rating : rating,
				note : note,
				customer_id: customer_id,
				product_id: product_id,
				flag: { dir:oracledb.BIND_OUT, type: oracledb.NUMBER }
			}
		)

		if (dbResponse.outBinds.flag === 0) {
			res.status(400).json({message: "you should bought first"})
		} else if (dbResponse.outBinds.flag === 1) {
			res.status(200).json({message: "review successfully added"})
		}
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.readByProduct = async(req, res) => {
	const product_id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_REVIEW_BYPRODUCT(:PRODUCT_ID);
			END;`, {
				product_id: product_id
			}
		)

		const result = dbResponse.implicitResults[0];

		res.status(200).json(result);
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.readByCustomer = async(req, res) => {
	const customer_id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_REVIEW_BYCUSTOMER(:CUSTOMER_ID);
			END;`, {
				customer_id:customer_id
			}
		)

		const result = dbResponse.implicitResults[0];

		res.status(200).json(result);
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}