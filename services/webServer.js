const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const database = require("./database");

const adminRouter = require("../routes/adminRouter");
const paymentRouter = require("../routes/paymentRouter");
const merchantRouter = require("../routes/merchantRouter");
const customerRouter = require("../routes/customerRouter");
const productRouter = require("../routes/productRouter");
const categoryRouter = require("../routes/categoryRouter");
const ordersRouter = require("../routes/ordersRouter");
const invoiceRouter = require("../routes/invoiceRouter");

exports.initServer = async() => {
	const app = express();
	
	app.use(cors());
	app.use(morgan('combined'));
	app.use(express.json());
	app.use(express.urlencoded({extended: true}));
	
	app.set('view engine', 'ejs');

	app.get('/', async(req, res) => {
		// const email = "suba@gmail.com";
		// const username = "suba";
		// const password = "qwerty";
		// const phone = "082234234";
		
		const result = await database.execute(
			`SELECT *
			FROM CUSTOMER
			`
		);

		
		
		// const result = await database.dbExecute(
		// `
		// 	INSERT INTO CUSTOMER(ID, EMAIL, USERNAME, PASSWORD, PHONE)
		// 	VALUES(NULL, :EMAIL, :USERNAME, :PASSWORD, :PHONE)
		// `, {
		// 	email: email,
		// 	username: username,
		// 	password: password,
		// 	phone: phone
		// }
		// );
		
		console.log(result.rows);
		res.send(`<h1>WELCOME ${result.rows[0].EMAIL}</h1>`);
		// res.send("hai");
	});
	
	app.use("/admin", adminRouter);
	app.use("/payment", paymentRouter);
	app.use("/merchant", merchantRouter);
	app.use("/customer", customerRouter);
	app.use("/product", productRouter);
	app.use("/category", categoryRouter);
	app.use("/orders", ordersRouter);
	app.use("/invoice", invoiceRouter);
	
	app.listen(6969, () => {
		console.log("Listening on port 6969");
	});

}