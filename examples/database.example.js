const Database = require("../modules/database");
const User = require("../modules/models/user");

const database = new Database("./database/runners.json", {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
});

database.deleteAll();

const user = new User(database, { username: `USERNAME`, category: `runs` });

user.write();

user.push({
	quest_name: `Quest Name 1`,
	time: `00'00"00`,
	weapon: `Weapon`,
	link: `Video Link`,
});

user.push({
	quest_name: `Quest Name 2`,
	time: `00'00"00`,
	weapon: `Weapon`,
	link: `Video Link`,
});

database.save();
