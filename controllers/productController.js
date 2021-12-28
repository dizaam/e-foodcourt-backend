const oracledb = require("oracledb");
const database = require("../services/database");

exports.readAll = async(req, res) => {
	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_ALL_PRODUCT();
			END;`
		);

		const result = dbResponse.implicitResults[0];

		console.log(result);

		res.status(200).json(result);
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}


exports.readAllAvailable = async(req, res) => {
	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_AVAILABLE_PRODUCT();
			END;`
		);

		const result = dbResponse.implicitResults[0];

		console.log(result);

		res.status(200).json(result);
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.readByCategory = async(req, res) => {
	const { category_id } = req.body;
	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_PRODUCT_BYCATEGORY(:category_id);
			END;`, {
				category_id: { dir: oracledb.BIND_IN, type: "ARRAY_OF_INTEGER", val: [...category_id] }
			}
		);
		const result = dbResponse.implicitResults[0];

		console.log(result);

		res.status(200).json(result);
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.readMerchant = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_PRODUCT_BYMERCHANT(:ID);
			END;`, {
				id: id
			}
		);

		const result = dbResponse.implicitResults[0];

		console.log(result);

		res.status(200).json(result);
	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.read = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_A_PRODUCT(:id);
				READ_CATEGORY_BYPRODUCT(:id);
			END;`, {
				id: id
			}
		);

		const result = {
			...dbResponse.implicitResults[0][0],
			CATEGORY: dbResponse.implicitResults[1].map(category => {
				return {
					CATEGORY_ID: category.CATEGORY_ID,
					NAME: category.NAME
				}
			})
		}

		console.log(result);

		res.status(200).json(result);

	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.create = async(req, res) => {
	const { title, description, price, stock, image_url, category_id, merchant_id} = req.body;
	console.log(req.body);

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:FLAG := CREATE_PRODUCT(:PRODUCT_ID, :TITLE, :DESCRIPTION, :PRICE, :STOCK, :IMAGE_URL, :MERCHANT_ID);

				CATEGORY_PKG.ADD_PRODUCT_CATEGORY(:PRODUCT_ID, :CATEGORY_ID);
			END;`, {
				product_id: { dir:oracledb.BIND_OUT, type: oracledb.NUMBER},
				title: title,
				description: description,
				price: price,
				stock: stock,
				image_url: image_url,
				category_id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: [...category_id]},
				merchant_id: merchant_id,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		if (dbResponse.outBinds.flag === 1) {
			res.status(400).json({message: "you cannot add same product"})
		} else if (dbResponse.outBinds.flag === 0) {
			res.status(200).json({message: "product successfully added"})
		}

	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.update = async(req, res) => {
	const { product_id, merchant_id, title, description, price, stock, image_url, category_id } = req.body;
	console.log(category_id);

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:FLAG := UPDATE_PRODUCT(:product_id, :TITLE, :DESCRIPTION, :PRICE, :STOCK, :IMAGE_URL, :merchant_id);

				CATEGORY_PKG.UPDATE_PRODUCT_CATEGORY(:product_id, :CATEGORY_ID);
			END;`, {
				product_id: product_id,
				title: title,
				description: description,
				price: price,
				stock: stock,
				image_url: image_url,
				merchant_id: merchant_id,
				// CATEGORY_ID: { dir: oracledb.BIND_IN, type: "CATEGORY_PKG.ARRAY_OF_INTEGER", val: [...category_id]},
				category_id: category_id,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
			}
		);

		if (dbResponse.outBinds.flag === 1) {
			res.status(400).json({message: "you cannot have duplicate product"})
		} else if (dbResponse.outBinds.flag === 0) {
			res.status(200).json({message: "product successfully updated"})
		}
	} catch(err) {
		res.status(500).json({message: err.message});
	}

}

exports.delete = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := DELETE_A_PRODUCT(:ID);
			END;`, {
				id: id,
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