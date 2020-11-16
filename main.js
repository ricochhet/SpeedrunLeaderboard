const Database = require("./modules/database");
const database = new Database("./database/runners.json", {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
});

database.deleteAll();

database.set("USERNAME", { name: "USERNAME" });
database.push("USERNAME", "runs", []);

database.get("USERNAME")["runs"].push({
	quest_name: "Quest Name",
	time: `00'00"00`,
	weapon: "Weapon Type",
	link: "Speedrun Link",
});

database.save();
