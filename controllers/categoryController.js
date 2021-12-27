const oracledb = require("oracledb");

const database = require("../services/database");

exports.readAll = async(req, res) => {

	try {
		const dbResponse = await database.execute(
			`BEGIN
				READ_ALL_CATEGORY();
			END;`
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
			`BEGIN
				READ_CATEGORY_BYPRODUCT(:ID);
			END;`, {
				ID: id
			}
		);

		console.log(dbResponse.rows);

		res.status(200).json(dbResponse.rows);

	} catch(err) {
		res.status(500).json({message: err.message});
	}

}

exports.create = async(req, res) => {
	const { name } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := CREATE_CATEGORY(:NAME, :ID);
			END;`, {
				name: name,
				id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER},
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		if (dbResponse.outBinds.flag === 1) {
			res.status(400).json({message: "you cannot add same category"})
		} else if (dbResponse.outBinds.flag === 0) {
			res.status(200).json({
				new_id: dbResponse.outBinds.id,
				message: "category successfully added"
			})
		}

	} catch(err) {
		res.status(500).json({message: err.message});
	}

}
