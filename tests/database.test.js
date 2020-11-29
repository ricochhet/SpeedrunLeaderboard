const Database = require("../modules/database");
const User = require("../modules/models/user");

const database_Options = {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
};

const database_Runners = new Database(
	"./database/runners.json",
	database_Options
);

const database_Submissions = new Database(
	"./database/submissions.json",
	database_Options
);

database_Runners.deleteAll();
database_Submissions.deleteAll();

const user_Runners = new User(database_Runners, {
	username: `Username_Runner`,
	category: `runs`,
});

const user_Submissions = new User(database_Submissions, {
	username: `Username_Submission`,
	category: `runs`,
});

user_Runners.write();
user_Submissions.write();

user_Runners.push({
	quest_name: `Quest Name 1`,
	time: `00'00"00`,
	weapon: `Weapon`,
	link: `Video Link`,
});

user_Submissions.push({
	quest_name: `Quest Name 1`,
	time: `00'00"00`,
	weapon: `Weapon`,
	link: `Video Link`,
});

database_Runners.save();
database_Submissions.save();
