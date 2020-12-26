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

router.get("/runners", function (req, res) {
	try {
		const database = new Database(
			"./database/tables/leaderboard/user/runners/table.json",
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

router.get("/runners/all", function (req, res) {
	try {
		const database = new Database(
			"./database/tables/leaderboard/user/runners/table.json",
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

router.get("/runners/:user", function (req, res) {
	try {
		const database = new Database(
			"./database/tables/leaderboard/user/runners/table.json",
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

router.post("/runners", function (req, res) {
	try {
		const data = req.body;

		const db = new Database(
			"./database/tables/leaderboard/user/runners/table.json",
			dbOptions
		);

		const user = new User(db, {
			username: data.name,
			category: `runs`,
		});

		if (db.get(parser.toURL(data.name.toLowerCase())) == null) {
			user.write();
		}

		user.push({
			id: data.run.id,
			name: data.run.name,
			quest: data.run.quest,
			time: data.run.time,
			weapon: data.run.weapon,
			link: data.run.link,
			platform: data.run.platform,
			ruleset: data.run.ruleset,
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
