class User {
	constructor(database, options = { username: `USERNAME`, category: `runs` }) {
		this.database = database;
		this.options = options;
		this.submission = {
			quest_name: `Quest Name`,
			time: `00'00"00`,
			weapon: `Weapon`,
			link: `Video Link`,
			platform: `Platform`,
			ruleset: "TA / Freestyle"
		};
	}

	write() {
		this.database.set(this.options.username.toLowerCase(), { name: this.options.username });
		this.database.push(this.options.username.toLowerCase(), this.options.category, []);

		return this;
	}

	push(data = this.submission) {
		this.database.get(this.options.username.toLowerCase())[this.options.category].push({
			quest_name: data.quest_name,
			time: data.time,
			weapon: data.weapon,
			link: data.link,
			platform: data.platform,
			ruleset: data.ruleset
		});

		return this;
	}
}

module.exports = User;
