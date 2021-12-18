const oracledb = require("oracledb");
const database = require("../services/database");

exports.readAllAvailableProduct = async(req, res) => {
	try {
		const dbResponse = await database.execute(
			`SELECT PRODUCT.ID, TITLE, DESCRIPTION, IMAGE_URL, PRICE, STOCK, MERCHANT_ID, CATEGORY_ID
			FROM PRODUCT 
			INNER JOIN MERCHANT ON MERCHANT_ID = MERCHANT.ID
			WHERE STATUS = 1
			`
		);

		console.log(dbResponse.rows);

		res.status(200).json(dbResponse.rows);

	} catch(err) {
		res.status(500).json({message: err.message});
	}
}

exports.readMerchantProduct = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`SELECT *
			FROM PRODUCT
			WHERE MERCHANT_ID = :ID
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

exports.readProduct = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`SELECT *
			FROM PRODUCT
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

exports.createProduct = async(req, res) => {
	const { title, description, price, stock, image_url, category_id, merchant_id} = req.body;
	console.log(req.body);

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:FLAG := CREATE_PRODUCT(:TITLE, :DESCRIPTION, :PRICE, :STOCK, :IMAGE_URL, :CATEGORY_ID, :MERCHANT_ID);
			END;`, {
				title: title,
				description: description,
				price: price,
				stock: stock,
				image_url: image_url,
				category_id: category_id,
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

exports.updateProduct = async(req, res) => {
	const id = req.params.id;
	const { title, description, price, stock, image_url, category_id } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				UPDATE_PRODUCT(:ID, :TITLE, :DESCRIPTION, :PRICE, :STOCK, :IMAGE_URL, :CATEGORY_ID);
			END;`, {
				id: id,
				title: title,
				description: description,
				price: price,
				stock: stock,
				image_url: image_url,
				category_id: category_id
			}
		);

		// console.log(dbResponse);
		// if (dbResponse.outBinds.flag === 1) {
		// 	res.status(400).json({message: "you cannot add same product"})
		// } else if (dbResponse.outBinds.flag === 0) {
		// 	res.status(200).json({message: "product successfully added"})
		// }

		res.status(200).json({message: "product successfully updated"});

	} catch(err) {
		res.status(500).json({message: err.message});
	}

}

exports.deleteProduct = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`DELETE FROM PRODUCT
			WHERE ID = :ID
			`, {
				id: id
			}
		);
			
		return res.status(200).json("Product deleted");

	} catch(err) {
		return res.status(500).json({error: err.message})
	}

}