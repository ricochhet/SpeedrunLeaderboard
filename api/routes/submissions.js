const Database = require("../../database/database");
const User = require("../models/user");
const parser = require("../../database/utils/parser");
const arrayUtils = require("../../utils/arrayUtils");
const router = require("express").Router();
const winston = require("../../utils/winstonLogger");

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
	try {
		const database = new Database(
			"./database/tables/leaderboard/user/submissions/table.json",
			opts
		);
		res.json(database.json);
	} catch (e) {
		res.json({ message: "Could not parse database" });
		winston.log({
			level: "error",
			message: e,
		});
	}
});

router.get("/submissions/all", function (req, res) {
	try {
		const database = new Database(
			"./database/tables/leaderboard/user/submissions/table.json",
			opts
		);
		res.json(parser.toArray(database.json));
	} catch (e) {
		res.json({ message: "Could not parse database" });
		winston.log({
			level: "error",
			message: e,
		});
	}
});

router.get("/submissions/:user", function (req, res) {
	try {
		const database = new Database(
			"./database/tables/leaderboard/user/submissions/table.json",
			opts
		);
		if (database.get(req.params.user) == null)
			return res.json({ message: "User not found", status: 404 });
		res.json(database.get(req.params.user));
	} catch (e) {
		res.json({ message: "Could not parse database" });
		winston.log({
			level: "error",
			message: e,
		});
	}
});

router.delete("/submissions", function (req, res) {
	try {
		const data = req.body;
		const runner = data.name;
		const id = data.id;
		const db = new Database(
			"./database/tables/leaderboard/user/submissions/table.json",
			dbOptions
		);

		const user = db.get(parser.toURL(runner.toString().toLowerCase()));
		const runsMap = new Map();

		if (user == null || user == "") return;
		if (user["runs"] == null || user["runs"] == "") return;

		for (const i in user["runs"]) {
			runsMap.set(user["runs"][i]["id"], user["runs"][i]);
		}

		runsMap.delete(id);
		const items = [];
		runsMap.forEach((item) => {
			items.push(item);
		});

		db.json[parser.toURL(runner.toString().toLowerCase())]["runs"] = items;
		console.log
		db.save();
	} catch (e) {
		res.json({ message: "Could not parse database" });
		winston.log({
			level: "error",
			message: e,
		});
	}
});

router.post("/submissions", function (req, res) {
	try {
		const data = req.body;

		const db = new Database(
			"./database/tables/leaderboard/user/submissions/table.json",
			dbOptions
		);

		const user = new User(db, {
			username: data["name"],
			category: `runs`,
		});

		if (db.get(parser.toURL(data["name"].toLowerCase())) == null) {
			user.write();
		}

		user.push({
			name: data["name"],
			id: data["id"],
			quest: data["quest"],
			time: data["time"],
			weapon: data["weapon"],
			link: data["link"],
			platform: data["platform"],
			ruleset: data["ruleset"],
		});

		db.save();

		res.sendStatus(201);
	} catch (e) {
		res.json({ message: "Could not parse database" });
		winston.log({
			level: "error",
			message: e,
		});
	}
});

module.exports = router;
