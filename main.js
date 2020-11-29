require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = process.env.API_PORT || 4000;

const app = express();

// Routers
const runners = require("./modules/routes/runners");

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());

// Routers
app.use("/api", runners);

app.get("/", (req, res) => {
	res.json({
		message: "Hello, World.",
	});
});

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
