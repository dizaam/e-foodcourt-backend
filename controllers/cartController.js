const oracledb = require("oracledb");
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

exports.update = async(req, res) => {
	const { customer_id, product_id, quantity, note } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := UPDATE_CART_ITEM(:customer_id, :product_id, :quantity, :note);
			END;`,{
				customer_id: customer_id,
				product_id: product_id,
				quantity: quantity,
				note: note,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.flag === 1) {
			console.log("Stock habis");

			return res.status(403).json({message: "Product out of stock"});
		} else {
			console.log("Succes add to cart");

			return res.status(200).json({message: "Product updated"});
		}
	}catch (err) {
		res.status(500).json({error: err.message});
	}
}

exports.delete = async(req, res) => {
	console.log(req.body);
	const { customer_id, product_id } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := DELETE_CART_ITEM(:customer_id, :product_id);
			END;`, {
				customer_id: customer_id,
				product_id: product_id,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
			}
		);

		const result = dbResponse.outBinds.flag;
		
		console.log(result);

		if (result) {
			return res.status(200).json("Product deleted");
		} else {
			return res.status(400).json("Product not found");
		}
	} catch(err) {
		return res.status(500).json({error: err.message})
	}

}