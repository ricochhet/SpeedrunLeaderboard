const Database = require("../../database/database");
const parser = require("../../database/utils/parser");
const arrayUtils = require("../../utils/arrayUtils");
const router = require("express").Router();
const winston = require("../../utils/winstonLogger");

const opts = {
	encoding: "utf-8",
	delimiter: ".",
	spacing: "\t",
};

router.get("/rise/quests", function (req, res) {
	try {
		const database = new Database(
			"./database/tables/leaderboard/data.json",
			opts
		);
		const quests = database.json["rise"]["quests"];
		const questData = [];

		for (const i in quests) {
			quests[i]["id"] = parser.toURL(quests[i].name);
			questData.push(quests);
		}
		
		res.json(quests);
	} catch (e) {
		res.json({ message: "Could not parse database" });
		winston.log({
			level: "error",
			message: e,
		});
	}
});

router.get(
	"/rise/quests/:name/:weapon/:ruleset/:platform",
	function (req, res) {
		try {
			const params = req.params;

			const database = new Database(
				"./database/tables/leaderboard/data.json",
				opts
			);

			const runners = new Database(
				"./database/tables/leaderboard/user/runners/table.json",
				opts
			);

			const rawQuestRunnerData = [];
			const runnersArray = parser.toArray(runners.json);

			for (const i in runnersArray) {
				const runs = runnersArray[i]["runs"];
				for (const k in runs) {
					rawQuestRunnerData.push(runs[k]);
				}
			}

			const runs = [];

			for (const i in rawQuestRunnerData) {
				try {
					const questName = parser.toURL(rawQuestRunnerData[i]["quest"]);

					// Parse each part of the timestamp so we can later sort by fastest / slowest
					const questMinutes = parser.timeFetch(
						rawQuestRunnerData[i]["time"],
						"minutes"
					);
					const questSeconds = parser.timeFetch(
						rawQuestRunnerData[i]["time"],
						"seconds"
					);
					const questMilliseconds = parser.timeFetch(
						rawQuestRunnerData[i]["time"],
						"milliseconds"
					);
	
					// A bit hacky but it's not a big deal
					rawQuestRunnerData[i]["quest_minutes"] = questMinutes;
					rawQuestRunnerData[i]["quest_seconds"] = questSeconds;
					rawQuestRunnerData[i]["quest_milliseconds"] = questMilliseconds;
	
					if (params.name == questName) {
						runs.push(rawQuestRunnerData[i]);
					}
				} catch (e) {
					res.json({ message: "Could not parse database" });
					winston.log({
						level: "error",
						message: e,
					});
				}
			}

			// This sorts by fastest to slowest, you can use a "-" in front of each string to sort by opposite of that
			const questRunnerDataTimeSorted = runs.sort(
				arrayUtils.dynamicSortMultiple(
					"quest_minutes",
					"quest_seconds",
					"quest_milliseconds"
				)
			);

			const rawValidWeaponTypes = database.json["rise"]["weapons"];
			const rawValidPlatforms = database.json["rise"]["platforms"];
			const rawValidRulesets = database.json["rise"]["rulesets"];

			const validWeaponTypes = [];
			const validPlatforms = [];
			const validRulesets = [];

			for (const i in rawValidWeaponTypes) {
				validWeaponTypes.push(parser.toURL(rawValidWeaponTypes[i].name));
				validWeaponTypes.push("all"); // I added an "all" to here for ease of use when sorting
			}

			for (const i in rawValidPlatforms) {
				validPlatforms.push(parser.toURL(rawValidPlatforms[i].name));
				validPlatforms.push("all"); // I added an "all" to here for ease of use when sorting
			}

			for (const i in rawValidRulesets) {
				validRulesets.push(parser.toURL(rawValidRulesets[i].name));
				validRulesets.push("all"); // I added an "all" to here for ease of use when sorting
			}

			const questRunnerDataWeaponSorted = [];
			const questRunnerDataRulesetSorted = [];
			const questRunnerDataPlatformSorted = [];

			for (const i in questRunnerDataTimeSorted) {
				const weaponType = parser.toURL(questRunnerDataTimeSorted[i]["weapon"]);

				if (validWeaponTypes.includes(params.weapon)) {
					if (params.weapon == weaponType) {
						questRunnerDataWeaponSorted.push(questRunnerDataTimeSorted[i]);
					} else if (params.weapon == "all") {
						questRunnerDataWeaponSorted.push(questRunnerDataTimeSorted[i]);
					}
				} else {
					winston.log({
						level: "error",
						message: "404 @ forloop 'questRunnerDataTimeSorted'",
					});

					return res.json({ status: 404 });
				}
			}

			for (const i in questRunnerDataWeaponSorted) {
				const ruleset = parser.toURL(questRunnerDataWeaponSorted[i]["ruleset"]);

				if (validRulesets.includes(params.ruleset)) {
					if (params.ruleset == ruleset) {
						questRunnerDataRulesetSorted.push(questRunnerDataWeaponSorted[i]);
					} else if (params.ruleset == "all") {
						questRunnerDataRulesetSorted.push(questRunnerDataWeaponSorted[i]);
					}
				} else {
					winston.log({
						level: "error",
						message: "404 @ forloop 'questRunnerDataWeaponSorted'",
					});

					return res.json({ status: 404 });
				}
			}

			for (const i in questRunnerDataRulesetSorted) {
				const platform = parser.toURL(questRunnerDataRulesetSorted[i]["platform"]);

				if (validPlatforms.includes(params.platform)) {
					if (params.platform == platform) {
						questRunnerDataPlatformSorted.push(questRunnerDataRulesetSorted[i]);
					} else if (params.platform == "all") {
						questRunnerDataPlatformSorted.push(questRunnerDataRulesetSorted[i]);
					}
				} else {
					winston.log({
						level: "error",
						message: "404 @ forloop 'questRunnerDataRulesetSorted'",
					});

					return res.json({ status: 404 });
				}
			}

			res.json(questRunnerDataPlatformSorted);
		} catch (e) {
			res.json({ message: "Could not parse database" });
			winston.log({
				level: "error",
				message: e,
			});
		}
	}
);

router.get(
	"/rise/quests/rankings/:name/:weapon/:ruleset",
	function (req, res) {
		try {
			const params = req.params;

			const database = new Database(
				"./database/tables/leaderboard/data.json",
				opts
			);

			const runners = new Database(
				"./database/tables/leaderboard/user/runners/table.json",
				opts
			);

			const rawQuestRunnerData = [];
			const runnersArray = parser.toArray(runners.json);

			for (const i in runnersArray) {
				const runs = runnersArray[i]["runs"];
				for (const k in runs) {
					rawQuestRunnerData.push(runs[k]);
				}
			}

			const runs = [];

			for (const i in rawQuestRunnerData) {
				const questName = parser.toURL(rawQuestRunnerData[i]["quest"]);

				// Parse each part of the timestamp so we can later sort by fastest / slowest
				const questMinutes = parser.timeFetch(
					rawQuestRunnerData[i]["time"],
					"minutes"
				);
				const questSeconds = parser.timeFetch(
					rawQuestRunnerData[i]["time"],
					"seconds"
				);
				const questMilliseconds = parser.timeFetch(
					rawQuestRunnerData[i]["time"],
					"milliseconds"
				);

				// A bit hacky but it's not a big deal
				rawQuestRunnerData[i]["quest_minutes"] = questMinutes;
				rawQuestRunnerData[i]["quest_seconds"] = questSeconds;
				rawQuestRunnerData[i]["quest_milliseconds"] = questMilliseconds;

				if (params.name == questName) {
					runs.push(rawQuestRunnerData[i]);
				}
			}

			// This sorts by fastest to slowest, you can use a "-" in front of each string to sort by opposite of that
			const questRunnerDataTimeSorted = runs.sort(
				arrayUtils.dynamicSortMultiple(
					"quest_minutes",
					"quest_seconds",
					"quest_milliseconds"
				)
			);

			const rawValidWeaponTypes = database.json["rise"]["weapons"];
			const rawValidRulesets = database.json["rise"]["rulesets"];

			const validWeaponTypes = [];
			const validRulesets = [];

			for (const i in rawValidWeaponTypes) {
				validWeaponTypes.push(parser.toURL(rawValidWeaponTypes[i].name));
			}

			for (const i in rawValidRulesets) {
				validRulesets.push(parser.toURL(rawValidRulesets[i].name));
			}

			const questRunnerDataWeaponSorted = [];
			const questRunnerDataRulesetSorted = [];

			for (const i in questRunnerDataTimeSorted) {
				const weaponType = parser.toURL(questRunnerDataTimeSorted[i]["weapon"]);

				if (validWeaponTypes.includes(params.weapon)) {
					if (params.weapon == weaponType) {
						questRunnerDataWeaponSorted.push(questRunnerDataTimeSorted[i]);
					}
				} else {
					winston.log({
						level: "error",
						message: "404 @ forloop 'questRunnerDataTimeSorted'",
					});

					return res.json({ status: 404 });
				}
			}

			for (const i in questRunnerDataWeaponSorted) {
				const ruleset = parser.toURL(questRunnerDataWeaponSorted[i]["ruleset"]);

				if (validRulesets.includes(params.ruleset)) {
					if (params.ruleset == ruleset) {
						questRunnerDataRulesetSorted.push(questRunnerDataWeaponSorted[i]);
					}
				} else {
					winston.log({
						level: "error",
						message: "404 @ forloop 'questRunnerDataWeaponSorted'",
					});

					return res.json({ status: 404 });
				}
			}

			res.json(questRunnerDataRulesetSorted.slice(0, 3));
		} catch (e) {
			res.json({ message: "Could not parse database" });
			winston.log({
				level: "error",
				message: e,
			});
		}
	}
);

module.exports = router;
