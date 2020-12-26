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


router.get("/leaderboard", function (req, res) {
	const database = new Database("./database/tables/leaderboard/data.json", opts);

	try {
		res.json(database.json);
	} catch (e) {
		res.json({ message: "Could not parse database" });
	}
});

module.exports = router;
