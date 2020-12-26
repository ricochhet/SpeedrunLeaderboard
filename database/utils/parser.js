class Parser {
	toArray(data) {
		const array = [];

		for (const i in data) {
			array.push(data[i]);
		}

		return array;
	}

	toJSON(data) {
		return JSON.parse(data);
	}

	toURL(str) {
		return str
			.toLowerCase()
			.split(" ")
			.join("-")
			.split("'")
			.join("")
			.split('"')
			.join("")
			.split("(")
			.join("")
			.split(")")
			.join("");
	}

	timeFetch(str, type) {
		if (type.toString().toLowerCase() == "minutes") {
			return str.toString().split("'")[0];
		} else if (type.toString().toLowerCase() == "seconds") {
			return str.toString().split("'")[1].split('"')[0];
		} else if (type.toString().toLowerCase() == "milliseconds") {
			return str.toString().split('"')[1];
		}
	}
}

module.exports = new Parser();
