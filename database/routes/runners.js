const Database = require("../database");
const parser = require("../utils/parser");
const router = require("express").Router();
const fs = require("fs");

const opts = {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
};

router.get("/runners", function (req, res) {
	const database = new Database("./database/tables/user/runners/table.json", opts);

	try {
		res.json(database.json);
	} catch (e) {
		res.json({ message: "Could not parse database" });
	}
});

router.get("/a/runners", function (req, res) {
	const database = new Database("./database/tables/user/runners/table.json", opts);

	try {
		res.json(parser.toArray(database.json));
	} catch (e) {
		res.json({ message: "Could not parse database" });
	}
});

router.get("/runners/:user", function (req, res) {
	const database = new Database("./database/tables/user/runners/table.json", opts);

	try {
		if (database.get(req.params.user) == null)
			return res.json({ message: "User not found", status: 404 });
		res.json(database.get(req.params.user));
	} catch (e) {
		console.log(e);
		res.json({ message: "Could not parse database" });
	}
});

module.exports = router;
