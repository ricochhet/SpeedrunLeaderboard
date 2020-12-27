const Database = require("../../database/database");
const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const dbParser = require("../../database/utils/parser");

const opts = {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
};

const dbOptions = {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
};

const verifierLogins = new Database(
	"./database/tables/leaderboard/logins.json",
	dbOptions
);

router.post("/login", (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.status(400).send([user, "Cannot log in", info]);
		}

		req.login(user, (err) => {
			res.send("Logged in");
		});
	})(req, res, next);
});

router.get("/logout", function (req, res) {
	req.logout();
	return res.send();
});

const dashboardAuthMiddleware = (req, res, next) => {
	if (!req.isAuthenticated()) {
		res.status(401).send("You are not authenticated");
	} else {
		return next();
	}
};

router.get("/user", dashboardAuthMiddleware, (req, res) => {
	let db = dbParser.toArray(verifierLogins.json);
	let user = db.find((user) => {
		return user.id === req.session.passport.user;
	});

	// console.log([user, req.session]);
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
			} else {
				done(null, false, { message: "Incorrect username or password" });
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	let db = dbParser.toArray(verifierLogins.json);
	let user = db.find((user) => {
		return user.id === id;
	});

	done(null, user);
});

module.exports = {
	router: router,
	authMiddleware: dashboardAuthMiddleware,
};