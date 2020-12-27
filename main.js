require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = process.env.API_PORT || 9000;
const winston = require("./utils/winstonLogger");
const cookieSession = require("cookie-session");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cryptoHelpers = require("./utils/cryptoHelpers");
const helmet = require("helmet");
const history = require("connect-history-api-fallback");
const app = express();

const runners = require("./api/routes/runners");
const submissions = require("./api/routes/submissions");
const leaderboard = require("./api/routes/leaderboard");
const quests = require("./api/routes/quests");
const monsters = require("./api/routes/monsters");
const apiAuth = require("./api/routes/auth");
const dashboardAuth = require("./api/routes/dashboard");

app.use(helmet());
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(cors({ credentials: true, origin: `http://localhost:9001` }));
app.use(bodyParser.json());
app.enable("trust proxy");

if (process.env.AUTH_MIDDLEWARE == "cookie-session") {
	app.use(
		cookieSession({
			name: "session",
			keys: [cryptoHelpers.generateAuthToken()],
			maxAge: 24 * 60 * 60 * 1000, // 24hrs
		})
	);
} else if (process.env.AUTH_MIDDLEWARE == "express-session") {
	app.use(
		expressSession({
			secret: cryptoHelpers.generateAuthToken(),
			resave: true,
			cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
			saveUninitialized: true,
		})
	);
} else {
	throw `AUTH_MIDDLEWARE IS NOT SET TO EITHER 'cookie-session' or 'express-session'`;
}

app.use(passport.initialize());
app.use(passport.session());

if (process.env.RELEASE == "production") {
	const publicRoot = process.env.PUBLIC_ROOT;
	const indexFile = process.env.INDEX_FILE;
	const staticMiddleware = express.static(publicRoot);

	app.use(staticMiddleware);

	app.use(
		history({
			disableDotRule: true,
			verbose: true,
		})
	);

	app.use(staticMiddleware);

	app.get("/", function (req, res) {
		res.render(publicRoot + indexFile);
	});
} else if (process.env.RELEASE == "development") {
	app.get("/", (req, res) => {
		res.json({
			message: "...",
		});
	});
} else {
	throw `PROCESS ENVAR IS NOT SET TO EITHER 'development' or 'production'`;
}

app.use("/api/auth", apiAuth.router);
app.use("/api/dashboard/auth", dashboardAuth.router);
app.use("/api/leaderboard", apiAuth.authMiddleware, runners);
app.use("/api/leaderboard", apiAuth.authMiddleware, submissions);
app.use("/api/leaderboard", apiAuth.authMiddleware, leaderboard);
app.use("/api", apiAuth.authMiddleware, quests);
app.use("/api", apiAuth.authMiddleware, monsters);

app.listen(port, () => {
	winston.log({
		level: "info",
		message: `Listening on ${port}`,
	});
});
