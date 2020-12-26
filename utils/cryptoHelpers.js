const crypto = require("crypto");

class CryptoHelpers {
	generateAuthToken() {
		return crypto.randomBytes(30).toString("hex");
	}
}

module.exports = new CryptoHelpers();
