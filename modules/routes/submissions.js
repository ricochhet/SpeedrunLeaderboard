const Database = require("../database");
const router = require("express").Router();
const fs = require("fs");

const database_Options = {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
};

router.get("/submissions", function (req, res) {
	const database = new Database(
		"./database/submissions.json",
		database_Options
	);

	try {
		res.json(database.json);
	} catch (e) {
		res.json({ message: "Could not parse database" });
	}
});

router.get("/submissions/:user", function (req, res) {
	const database = new Database(
		"./database/submissions.json",
		database_Options
	);

	try {
		if (database.get(req.params.user) == null)
			return res.json({ message: "User not found" });
		res.json(database.get(req.params.user));
	} catch (e) {
		console.log(e);
		res.json({ message: "Could not parse database" });
	}
});

module.exports = router;
