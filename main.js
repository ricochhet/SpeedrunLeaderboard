require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = process.env.API_PORT || 4000;
const winston = require("./modules/winston.log");

const app = express();

// Routers
const runners = require("./modules/routes/runners");
const submissions = require("./modules/routes/submissions");
const { level } = require("./modules/winston.log");

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());

// Routers
app.use("/api", runners);
app.use("/api", submissions);

app.get("/", (req, res) => {
	res.json({
		message: "Hello, World.",
	});
});

app.listen(port, () => {
	winston.log({
		level: "info",
		message: `Listening on ${port}`,
	});
});
