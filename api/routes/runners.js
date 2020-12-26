const Database = require("../../database/database");
const User = require("../models/user");
const parser = require("../../database/utils/parser");
const array = require("../../utils/array");
const router = require("express").Router();

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
	const database = new Database(
		"./database/tables/leaderboard/user/runners/table.json",
		opts
	);

	try {
		res.json(database.json);
	} catch (e) {
		res.json({ message: "Could not parse database" });
	}
});

router.get("/runners/all", function (req, res) {
	const database = new Database(
		"./database/tables/leaderboard/user/runners/table.json",
		opts
	);

	try {
		res.json(parser.toArray(database.json));
	} catch (e) {
		res.json({ message: "Could not parse database" });
	}
});

router.get("/runners/:user", function (req, res) {
	const database = new Database(
		"./database/tables/leaderboard/user/runners/table.json",
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

router.post("/runners", function (req, res) {
	const data = req.body;

	const db = new Database(
		"./database/tables/leaderboard/user/runners/table.json",
		dbOptions
	);

	const user = new User(db, {
		username: data.name,
		category: `runs`,
	});

	if (db.get(data.name.toLowerCase()) == null) {
		user.write();
	}

	user.push({
		id: data.run.id,
		quest_name: data.run.quest_name,
		time: data.run.time,
		weapon: data.run.weapon,
		link: data.run.link,
		platform: data.run.platform,
		ruleset: data.run.ruleset,
	});

	// This code block is supposed to remove duplicate submissions, but it's not working at the moment, but it's here for reference :)
	/*const removedDuplicates = array.removeObjectDuplicates(
		db.json[data.name.toLowerCase().toString().toLowerCase()]["runs"]
	);
	db.json[data.name.toLowerCase().toString().toLowerCase()][
		"runs"
	] = removedDuplicates;*/

	db.save();

	res.sendStatus(201);
});

module.exports = router;
