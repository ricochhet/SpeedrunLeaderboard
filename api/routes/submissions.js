const Database = require("../../database/database");
const User = require("../models/user");
const parser = require("../../database/utils/parser");
const array = require("../../utils/array");
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
		"./database/tables/leaderboard/user/submissions/table.json",
		opts
	);

	try {
		res.json(database.json);
	} catch (e) {
		res.json({ message: "Could not parse database" });
	}
});

router.get("/submissions/all", function (req, res) {
	const database = new Database(
		"./database/tables/leaderboard/user/submissions/table.json",
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
		"./database/tables/leaderboard/user/submissions/table.json",
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

router.delete("/submissions", function (req, res) {
	const data = req.body;
	const runner = data.id.split(":")[0];
	const id = data.id;

	try {
		const db = new Database(
			"./database/tables/leaderboard/user/submissions/table.json",
			dbOptions
		);

		const user = db.get(runner.toString().toLowerCase());
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

		db.json[runner.toString().toLowerCase()]["runs"] = items;
		db.save();
	} catch (e) {
		console.log(e);
	}
});

router.post("/submissions", function (req, res) {
	const userData = new Map();
	const data = req.body;

	const db = new Database(
		"./database/tables/leaderboard/user/submissions/table.json",
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
		id: userData.get("id"),
		quest_name: userData.get("quest"),
		time: userData.get("time"),
		weapon: userData.get("weapon"),
		link: userData.get("link"),
		platform: userData.get("platform"),
		ruleset: userData.get("ruleset"),
	});

	const removedDuplicates = array.removeObjectDuplicates(
		db.json[userData.get("runner").toString().toLowerCase()]["runs"]
	);
	db.json[userData.get("runner").toString().toLowerCase()][
		"runs"
	] = removedDuplicates;

	db.save();

	res.sendStatus(201);
});

module.exports = router;
