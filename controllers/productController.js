const oracledb = require("oracledb");
const database = require("../services/database");

exports.readAllAvailable = async(req, res) => {
	try {
		const dbResponse = await database.execute(
			`SELECT PRODUCT.ID, TITLE, DESCRIPTION, IMAGE_URL, PRICE, STOCK, MERCHANT_ID
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

exports.readCategory = async(req, res) => {
	const { category_id } = req.body;
	try {
		const dbResponse = await database.execute(
			`SELECT DISTINCT ID, TITLE, TO_CHAR(DESCRIPTION), IMAGE_URL, PRICE, STOCK, MERCHANT_ID
			FROM PRODUCT 
			INNER JOIN PRODUCT_CATEGORY ON PRODUCT_ID = PRODUCT.ID
			WHERE CATEGORY_ID IN (${[...category_id]})
			`
		);

		console.log(dbResponse.rows);

		res.status(200).json(dbResponse.rows);

	} catch(err) {
		res.status(500).json({message: err.message});
	}

}

exports.readMerchant = async(req, res) => {
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

exports.read = async(req, res) => {
	const id = req.params.id;

	try {
		const getCategory = await database.execute(
			`SELECT * 
			FROM PRODUCT_CATEGORY
			WHERE PRODUCT_ID = :ID
			`, {
				ID: id
			}
		)

		const categories = getCategory.rows.map(category => {
			return category.CATEGORY_ID;
		})

		const dbResponse = await database.execute(
			`SELECT *
			FROM PRODUCT
			WHERE ID = :ID
			`, {
				id: id
			}
		);

		const result = dbResponse.rows.map(product => {
			return {
				...product,
				CATEGORY_ID: [...categories]
			}
		})

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
	const id = req.params.id;
	const { title, description, price, stock, image_url, category_id } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:FLAG := UPDATE_PRODUCT(:ID, :TITLE, :DESCRIPTION, :PRICE, :STOCK, :IMAGE_URL);

				CATEGORY_PKG.UPDATE_PRODUCT_CATEGORY(:ID, :CATEGORY_ID);
			END;`, {
				id: id,
				title: title,
				description: description,
				price: price,
				stock: stock,
				image_url: image_url,
				CATEGORY_ID: category_id,
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