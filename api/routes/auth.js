const Database = require("../../database/database");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const dbParser = require("../../database/utils/parser");

const dbOptions = {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
};

const apiSubLogins = new Database("./database/tables/logins.json", dbOptions);

const accessTokenSecret = "foo";
const refreshTokenSecret = "yourrefreshtokensecrethere";
const refreshTokens = [];

router.post("/login", (req, res) => {
	console.log(req.body);
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

router.post("/token", (req, res) => {
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

router.post("/logout", (req, res) => {
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

module.exports = {
	router: router,
	authMiddleware: authenticateJWT,
};
