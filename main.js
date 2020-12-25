require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = process.env.API_PORT || 9000;
const winston = require("./utils/winston.log");

const app = express();

// Routers
const runners = require("./database/routes/runners");
const submissions = require("./database/routes/submissions");
const leaderboardData = require("./database/routes/leaderboard");

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());

// Routers
app.use("/api", runners);
app.use("/api", submissions);
app.use("/api", leaderboardData);

app.get("/", (req, res) => {
	res.json({
		message: "...",
	});
});

app.listen(port, () => {
	winston.log({
		level: "info",
		message: `Listening on ${port}`,
	});
});
