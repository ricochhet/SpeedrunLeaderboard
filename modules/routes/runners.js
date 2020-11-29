const router = require("express").Router();
const fs = require("fs");

router.use(function timeLog(req, res, next) {
	console.log("Time: ", Date.now());
	next();
});

router.get("/runners", function (req, res) {
	try {
		res.json(JSON.parse(fs.readFileSync("./database/runners.json", "utf-8")));
	} catch (e) {
		res.json({ message: "Could not parse database" });
	}
});

module.exports = router;
