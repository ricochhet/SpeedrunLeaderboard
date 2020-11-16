const fs = require("fs");

class Database {
	constructor(
		database,
		options = { encoding: "utf-8", delimiter: ".", spacing: "\t" }
	) {
		this.database = database;
		this.encoding = options.encoding;
		this.delimiter = options.delimiter;
		this.spacing = options.spacing;
		this.json = JSON.parse(fs.readFileSync(database, options.encoding));
	}

	write(object) {
		return fs.writeFile(
			this.database,
			JSON.stringify(object, null, this.spacing),
			(err) => {
				if (err) console.log(err);
			}
		);
	}

	get(key) {
		if (this.json[key] != null) {
			return this.json[key];
		}
	}

	set(key, value) {
		this.json[key] = value;
	}

	push(key, prop, value) {
		if (this.json[key] != null) {
			this.json[key][prop] = value;
		}
	}

	clear(key) {
		if (this.json[key] != null) {
			this.json[key] = {};
		}
	}

	delete(key) {
		delete this.json[key];
	}

	clearAll() {
		for (const i in this.json) {
			this.json[i] = {};
		}
	}

	deleteAll() {
		for (const i in this.json) {
			delete this.json[i];
		}
	}

	save() {
		const object = {};

		for (const i of Object.keys(this.json)) {
			const keys = i.split(this.delimiter);
			const last = keys.pop();

			keys.reduce((obj, str) => (obj[str] = obj[str] || {}), object)[
				last
			] = this.json[i];
		}

		this.write(object);
	}
}

module.exports = Database;
