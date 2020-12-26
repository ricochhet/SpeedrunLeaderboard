const parser = require("../../database/utils/parser");

class User {
	constructor(database, options = { username: `USERNAME`, category: `runs` }) {
		this.database = database;
		this.options = options;
		this.submission = {
			id: null,
			name: `Runner Name`,
			quest: `Quest Name`,
			time: `00'00"00`,
			weapon: `Weapon`,
			link: `Video Link`,
			platform: `Platform`,
			ruleset: "TA / Freestyle",
		};
	}

	write() {
		this.database.set(parser.toURL(this.options.username.toLowerCase()), {
			name: this.options.username,
		});
		this.database.push(
			parser.toURL(this.options.username.toLowerCase()),
			this.options.category,
			[]
		);

		return this;
	}

	push(data = this.submission) {
		this.database
			.get(parser.toURL(this.options.username.toLowerCase()))
			[this.options.category].push({
				id: data.id,
				name: data.name,
				quest: data.quest,
				time: data.time,
				weapon: data.weapon,
				link: data.link,
				platform: data.platform,
				ruleset: data.ruleset,
			});

		return this;
	}
}

module.exports = User;
