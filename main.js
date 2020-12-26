require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = process.env.API_PORT || 9000;
const winston = require("./utils/winston.log");
const cookieSession = require("cookie-session");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cryptoHelpers = require("./utils/cryptoHelpers");
const Database = require("./database/database");
const dbParser = require("./database/utils/parser");
const serveStatic = require("serve-static");
const history = require("connect-history-api-fallback");

const app = express();

// Routers
const runners = require("./api/routes/runners");
const submissions = require("./api/routes/submissions");
const leaderboardData = require("./api/routes/leaderboard");
const { static } = require("express");
// const loginData = require("./api/routes/login");

const dbOptions = {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
};

const users = new Database(
	"./database/tables/leaderboard/logins.json",
	dbOptions
);

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

// Routers
app.use("/api/leaderboard", runners);
app.use("/api/leaderboard", submissions);
app.use("/api/leaderboard", leaderboardData);
// app.use("/api", loginData);

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

const authMiddleware = (req, res, next) => {
	console.log(req.isAuthenticated());
	if (!req.isAuthenticated()) {
		console.log("You are not authenticated");
		res.status(401).send("You are not authenticated");
	} else {
		console.log("Authenticated");
		return next();
	}
};

app.get("/api/user", authMiddleware, (req, res) => {
	let db = dbParser.toArray(users.json);
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
			let db = dbParser.toArray(users.json);
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
	let db = dbParser.toArray(users.json);
	let user = db.find((user) => {
		return user.id === id;
	});

	done(null, user);
	console.log("Deserialize user");
});

app.listen(port, () => {
	winston.log({
		level: "info",
		message: `Listening on ${port}`,
	});
});
