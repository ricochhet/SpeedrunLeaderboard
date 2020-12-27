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
const LocalStrategy = require("passport-local").Strategy;
const cryptoHelpers = require("./utils/cryptoHelpers");
const Database = require("./database/database");
const dbParser = require("./database/utils/parser");
const serveStatic = require("serve-static");
const helmet = require("helmet");
const history = require("connect-history-api-fallback");
const jwt = require("jsonwebtoken");
// temp
const accessTokenSecret = "foo";
const refreshTokenSecret = "yourrefreshtokensecrethere";
const refreshTokens = [];

const app = express();

// Routers
const runners = require("./api/routes/runners");
const submissions = require("./api/routes/submissions");

const leaderboardData = require("./api/routes/leaderboard");
const questData = require("./api/routes/quests");
// const loginData = require("./api/routes/login");

const dbOptions = {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
};

const verifierLogins = new Database(
	"./database/tables/leaderboard/logins.json",
	dbOptions
);

const apiSubLogins = new Database("./database/tables/logins.json", dbOptions);

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

app.post("/login", (req, res) => {
	const { username, password } = req.body;
	let db = dbParser.toArray(apiSubLogins.json);
	let user = db.find((user) => {
		return user.username === username && user.password === password;
	});

	if (user) {
		// generate an access token
		const accessToken = jwt.sign(
			{ username: user.username, role: user.role },
			accessTokenSecret,
			{ expiresIn: "20m" }
		);
		const refreshToken = jwt.sign(
			{ username: user.username, role: user.role },
			refreshTokenSecret
		);

		refreshTokens.push(refreshToken);

		res.json({
			accessToken,
			refreshToken,
		});
	} else {
		res.send("Username or password incorrect");
	}
});

app.post("/token", (req, res) => {
	const { token } = req.body;

	if (!token) {
		return res.sendStatus(401);
	}

	if (!refreshTokens.includes(token)) {
		return res.sendStatus(403);
	}

	jwt.verify(token, refreshTokenSecret, (err, user) => {
		if (err) {
			return res.sendStatus(403);
		}

		const accessToken = jwt.sign(
			{ username: user.username, role: user.role },
			accessTokenSecret,
			{ expiresIn: "20m" }
		);

		res.json({
			accessToken,
		});
	});
});

app.post("/logout", (req, res) => {
	const { token } = req.body;
	refreshTokens = refreshTokens.filter((token) => t !== token);

	res.send("Logout successful");
});

// We use a JWT middleware here because why not :)
const authenticateJWT = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(" ")[1];

		jwt.verify(token, accessTokenSecret, (err, user) => {
			if (err) {
				return res.sendStatus(403);
			}

			req.user = user;
			next();
		});
	} else {
		res.sendStatus(401);
	}
};

// API DASHBOARD LOGIN

app.post("/api/login", (req, res, next) => {
	console.log(req.body);
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			console.log("ERROR" + err);
			return next(err);
		}

		if (!user) {
			console.log("CANNOT LOG IN");
			return res.status(400).send([user, "Cannot log in", info]);
		}

		req.login(user, (err) => {
			res.send("Logged in");
		});
	})(req, res, next);
});

app.get("/api/logout", function (req, res) {
	req.logout();
	console.log("Logged out");
	return res.send();
});

const dashboardAuthMiddleware = (req, res, next) => {
	console.log(req.isAuthenticated());
	if (!req.isAuthenticated()) {
		console.log("You are not authenticated");
		res.status(401).send("You are not authenticated");
	} else {
		console.log("Authenticated");
		return next();
	}
};

app.get("/api/user", dashboardAuthMiddleware, (req, res) => {
	let db = dbParser.toArray(verifierLogins.json);
	let user = db.find((user) => {
		return user.id === req.session.passport.user;
	});

	console.log([user, req.session]);
	res.send({ user: user });
});

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		(username, password, done) => {
			let db = dbParser.toArray(verifierLogins.json);
			let user = db.find((user) => {
				return user.email === username && user.password === password;
			});

			if (user) {
				done(null, user);
				console.log(user);
			} else {
				done(null, false, { message: "Incorrect username or password" });
				console.log("Incorrect username or password");
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
	console.log("Serialize user");
});

passport.deserializeUser((id, done) => {
	let db = dbParser.toArray(verifierLogins.json);
	let user = db.find((user) => {
		return user.id === id;
	});

	done(null, user);
	console.log("Deserialize user");
});

// Routers
app.use("/api/leaderboard", authenticateJWT, runners);
app.use("/api/leaderboard", authenticateJWT, submissions);
app.use("/api/leaderboard", authenticateJWT, leaderboardData);
app.use("/api", authenticateJWT, questData);

app.listen(port, () => {
	winston.log({
		level: "info",
		message: `Listening on ${port}`,
	});
});
