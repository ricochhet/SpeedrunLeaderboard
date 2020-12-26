const fs = require("fs");
const path = require("path");

class FSUtils {
	constructor() {
		this.storage_recursiveFind_FUNC = [];
	}

	findFileName(str, extension = false) {
		if (extension) {
			return path.basename(str);
		} else {
			const ext = path.extname(str);
			return path.basename(str, ext);
		}
	}

	find(location, extension) {
		const files = [];

		fs.readdirSync(location).forEach((file) => {
			if (!extension) {
				files.push(file);
			} else {
				if (file.includes(extension)) {
					files.push(file);
				}
			}
		});

		return files;
	}

	findFull(location, extension) {
		const files = [];

		fs.readdirSync(location).forEach((file) => {
			if (!extension) {
				files.push(`${location}/${file}`);
			} else {
				if (file.includes(extension)) {
					files.push(`${location}/${file}`);
				}
			}
		});

		return files;
	}

	recursiveFind(directory) {
		fs.readdirSync(directory).forEach((file) => {
			const absolute = path.join(directory, file);
			if (fs.statSync(absolute).isDirectory()) {
				return this.recursiveFind(absolute);
			} else {
				return this.storage_recursiveFind_FUNC.push(absolute);
			}
		});

		return this.storage_recursiveFind_FUNC;
	}

	read(location) {
		return fs.readFileSync(location, "utf-8");
	}

	write(location, object) {
		fs.writeFile(location, object, (err) => {
			if (err) console.log(err);
		});
	}

	writeDir(directory, location, object) {
		fs.promises.mkdir(directory, { recursive: true }).catch((error) => {
			console.error("caught exception: ", error.message);
		});

		fs.writeFile(location, object, (err) => {
			if (err) console.log(err);
		});
	}
}

module.exports = new FSUtils();
