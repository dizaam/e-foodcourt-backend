const oracledb = require("oracledb");

const database = require("../services/database");
const token = require("../services/token");

exports.read = async(req, res) => {
	const id = req.params.id;

	try {
		const dbResponse = await database.execute(
			`SELECT *
			FROM CUSTOMER
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

exports.register = async(req, res) => {
	const {email, fullname, password, phone, gender} = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := CREATE_CUSTOMER(:email, :fullname, :password, :phone, :gender);
			END;`,{
				email: email,
				fullname: fullname,
				password: password,
				phone: phone, 
				gender: gender,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.flag === 0) {
			return res.status(200).json("Register succes");
		} else if (status.flag === 1) {
			return res.status(403).json("Please choose different email/phone");
		} else {
			return res.status(500).json("Server Error");
		}

	} catch(err) {
		return res.status(500).json({error: err.message})
	}
}

exports.login = async(req, res) => {
	const { unamemail, password } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:response := AUTHENTICATE_CUSTOMER(:unamemail, :password, :id);
			END;`,{
				unamemail: unamemail,
				password: password,
				id: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER},
				response: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.response === 1) {
			console.log("Login Gagal");

			return res.status(403).json({message: "Username/email and password combination doesnt match"});
		} else {
			console.log("Login Berhasil");

			const result = {
				id: status.id,
				token: token.createToken(status.id)
			}

			res.cookie('refreshToken', result.token.refreshToken, {httpOnly: true});

			return res.status(200).json(result);
		}
	}catch (err) {
		res.status(500).json({error: err.message});
		throw(err);
	}
	
}


exports.addToCart = async(req, res) => {
	const { customer_id, product_id, quantity, note } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := ADD_TO_CART(:customer_id, :product_id, :quantity, :note);
				UPDATE_CART(:customer_id);
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

			return res.status(200).json({message: "Product added to your cart"});
		}
	}catch (err) {
		res.status(500).json({error: err.message});
		throw(err);
	}

}

exports.checkout = async(req, res) => {
	const { customer_id, table_no, payment_method } = req.body;

	try {
		const dbResponse = await database.execute(
			`BEGIN
				:flag := CHECKOUT(:customer_id, :table_no, :payment_method);
			END;`,{
				customer_id: customer_id,
				table_no: table_no,
				payment_method: payment_method,
				flag: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
			}
		);

		const status = dbResponse.outBinds;

		if (status.flag === 1) {
			console.log("You can only orders at least 1 item");

			return res.status(403).json({message: "Failed, Ordering 0 product"});
		} else {
			console.log("Order Success");

			return res.status(200).json({message: "Succesfully ordered"});
		}
	}catch (err) {
		res.status(500).json({error: err.message});
		throw(err);
	}
}