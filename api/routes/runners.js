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

router.get("/runners/bans", function (req, res) {
	try {
		const database = new Database(
			"./database/tables/leaderboard/user/bans/table.json",
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

router.get("/runners/bans/all", function (req, res) {
	try {
		const database = new Database(
			"./database/tables/leaderboard/user/bans/table.json",
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
			id: parser.sanitize(data.run.id),
			name: parser.sanitize(data.run.name),
			quest: parser.sanitize(data.run.quest),
			time: parser.sanitize(data.run.time),
			weapon: parser.sanitize(data.run.weapon),
			link: parser.sanitize(data.run.link),
			platform: parser.sanitize(data.run.platform),
			ruleset: parser.sanitize(data.run.ruleset),
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

router.delete("/runners", function (req, res) {
	try {
		const data = req.body;
		const runner = data.name;
		const id = data.id;
		const db = new Database(
			"./database/tables/leaderboard/user/runners/table.json",
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
		db.save();
	} catch (e) {
		res.json({ message: "Could not parse database" });
		winston.log({
			level: "error",
			message: e,
		});
	}
});

router.post("/runners/bans", function (req, res) {
	try {
		const data = req.body;

		const db = new Database(
			"./database/tables/leaderboard/user/bans/table.json",
			dbOptions
		);

		db.json[parser.toURL(data.name.toLowerCase())] = {
			name: data.name,
			url: parser.toURL(data.name.toLowerCase())
		}

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
