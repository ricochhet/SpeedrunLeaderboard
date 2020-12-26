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

router.get("/leaderboard", function (req, res) {
	try {
		const database = new Database(
			"./database/tables/leaderboard/data.json",
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

module.exports = router;
