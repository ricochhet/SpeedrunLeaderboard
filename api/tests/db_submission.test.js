const Database = require("../../database/database");
const User = require("../models/user");

const dbOptions = {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
};

const db = new Database(
	"./database/tables/user/submissions/table.json",
	dbOptions
);

db.deleteAll();

const runner_1 = new User(db, {
	username: `Submission_1`,
	category: `runs`,
});

const runner_2 = new User(db, {
	username: `Submission_2`,
	category: `runs`,
});

runner_1.write();
runner_2.write();

runner_1.push({
	quest_name: `Quest Name 1`,
	time: `00'00"00`,
	weapon: `Weapon`,
	link: `Video Link`,
	platform: `Platform`,
	ruleset: "TA / Freestyle"
});

runner_2.push({
	quest_name: `Quest Name 2`,
	time: `00'00"00`,
	weapon: `Weapon`,
	link: `Video Link`,
	platform: `Platform`,
	ruleset: "TA / Freestyle"
});

db.save();