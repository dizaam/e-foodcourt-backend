const express = require('express');
const database = require("./services/database");
const morgan = require("morgan");

const merchantRouter = require("./routes/merchantRouter");
const customerRouter = require("./routes/customerRouter");
const productRouter = require("./routes/productRouter");

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
		
app.get('/', async(req, res) => {
	const result = await database.dbExecute(
	`
		SELECT *
		FROM CUSTOMER
	`);
	
	console.log(result.rows);
	res.send(`<h1>WELCOME ${result.rows[0].EMAIL}</h1>`);
});

app.use("/merchant", merchantRouter);
app.use("/customer", customerRouter);
app.use("/product", productRouter);

app.listen(6969, () => {
	console.log("Server running on port 6969");
});
