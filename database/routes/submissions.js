const Database = require("../database");
const User = require("../models/user");
const parser = require("../utils/parser");
const router = require("express").Router();
const fs = require("fs");

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

router.get("/submissions", function (req, res) {
	const database = new Database(
		"./database/tables/user/submissions/table.json",
		opts
	);

	try {
		res.json(database.json);
	} catch (e) {
		res.json({ message: "Could not parse database" });
	}
});

router.get("/a/submissions", function (req, res) {
	const database = new Database(
		"./database/tables/user/submissions/table.json",
		opts
	);

	try {
		res.json(parser.toArray(database.json));
	} catch (e) {
		res.json({ message: "Could not parse database" });
	}
});

router.get("/submissions/:user", function (req, res) {
	const database = new Database(
		"./database/tables/user/submissions/table.json",
		opts
	);

	try {
		if (database.get(req.params.user) == null)
			return res.json({ message: "User not found", status: 404 });
		res.json(database.get(req.params.user));
	} catch (e) {
		console.log(e);
		res.json({ message: "Could not parse database" });
	}
});

router.post("/submissions", function (req, res) {
	const userData = new Map();
	const data = req.body;

	const db = new Database(
		"./database/tables/user/submissions/table.json",
		dbOptions
	);

	for (const i in data) {
		userData.set(data[i].name, data[i].value);
	}

	const user = new User(db, {
		username: userData.get("runner"),
		category: `runs`,
	});

	if (db.get(userData.get("runner").toLowerCase()) == null) {
		user.write();
	}

	user.push({
		quest_name: userData.get("quest"),
		time: userData.get("time"),
		weapon: userData.get("weapon"),
		link: userData.get("link"),
		platform: userData.get("platform"),
		ruleset: userData.get("ruleset")
	});

	db.save();

	res.sendStatus(201);
});

module.exports = router;
