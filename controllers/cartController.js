const database = require("../services/database");

exports.read = async(req, res) => {
	const merchant_id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_CART(:merchant_id);
			END;`, {
				merchant_id: merchant_id
			}
		);

		console.log(dbResponse.implicitResults[0]);

		res.status(200).json(dbResponse.implicitResults[0]);
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.readDetail = async(req, res) => {
	const merchant_id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_CART_DETAIL(:merchant_id);
			END;`, {
				merchant_id: merchant_id
			}
		);

		console.log(dbResponse.implicitResults[0]);

		res.status(200).json(dbResponse.implicitResults[0]);
	} catch(err) {
		res.status(500).json({message: err.message});
	}

}