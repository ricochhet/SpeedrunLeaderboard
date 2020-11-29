class User {
	constructor(database, options = { username: `USERNAME`, category: `runs` }) {
		this.database = database;
		this.options = options;
	}

	write() {
		this.database.set(this.options.username, { name: this.options.username });
		this.database.push(this.options.username, this.options.category, []);

		return this;
	}

	push(
		data = {
			quest_name: `Quest Name`,
			time: `00'00"00`,
			weapon: `Weapon`,
			link: `Video Link`,
		}
	) {
		this.database.get(this.options.username)[this.options.category].push({
			quest_name: data.quest_name,
			time: data.time,
			weapon: data.weapon,
			link: data.link,
		});

		return this;
	}
}

module.exports = User;
