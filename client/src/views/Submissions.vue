<template>
  <div class="m-6">
    <p class="is-size-3"><strong>SUBMISSION FORM</strong></p>
    <p>
      Submit your speedrun, only top 3 runs are accepted. Please read the rules
      before submitting.
    </p>
    <a href="/rules">Rules</a>
  </div>
  <form id="submissionForm">
    <div class="m-6" style="width:25%;">
      <div class="field">
        <label class="label" for="runner">Runner (Name)</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Text input"
            name="runner"
            id="runner-text-field"
            maxlength="64"
          />
        </div>
        <p class="help is-danger" id="is-runner-blank" style="display:none;">
          This field cannot be blank!
        </p>
      </div>

      <div class="field">
        <label class="label" for="time">Time</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Text input"
            name="time"
            id="time-text-field"
            maxlength="64"
          />
        </div>
        <p class="help is-danger" id="is-time-blank" style="display:none;">
          This field cannot be blank!
        </p>
      </div>

      <div class="field">
        <label class="label" for="link">Link</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Text input"
            name="link"
            id="link-text-field"
            maxlength="64"
          />
        </div>
        <p class="help is-danger" id="is-link-blank" style="display:none;">
          This field cannot be blank!
        </p>
      </div>

      <div class="field">
        <label class="label" for="platform">Platform</label>
        <div class="control">
          <div class="select">
            <select name="platform" id="platform-select-field">
              <option
                v-for="platform in leaderboard.rise_platforms"
                :key="platform.name"
                >{{ platform.name }}</option
              >
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label" for="ruleset">Ruleset</label>
        <div class="control">
          <div class="select">
            <select name="ruleset" id="ruleset-select-field">
              <option
                v-for="ruleset in leaderboard.rise_rulesets"
                :key="ruleset.name"
                >{{ ruleset.name }}</option
              >
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label" for="weapon">Weapon</label>
        <div class="control">
          <div class="select">
            <select name="weapon" id="weapon-select-field">
              <option
                v-for="weapon in leaderboard.rise_weapons"
                :key="weapon.name"
                >{{ weapon.name }}</option
              >
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label" for="quest">Quest</label>
        <div class="control">
          <div class="select">
            <select name="quest" id="quest-select-field">
              <option
                v-for="quest in leaderboard.rise_quests"
                :key="quest.name"
                >{{ quest.name }}</option
              >
            </select>
          </div>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" type="submit">Submit</button>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import $ from "jquery";
import axios from "axios";
import crypto from "crypto";
import arrayUtils from "../utils/arrayUtils";
import getters from "../utils/getters";

export default {
  name: "Submissions",
  data: () => ({
    error: "",
    leaderboard: {
      rise_platforms: [],
      rise_rulesets: [],
      rise_weapons: [],
      rise_quests: []
    },
    bans: []
  }),
  methods: {
    generateAuthToken: function(byteCount) {
      return crypto.randomBytes(byteCount).toString("hex");
    }
  },
  mounted() {
    const self = this;
    axios
      .post(getters.URL.API_AUTH_LOGIN, {
        username: getters.ENV.API_USERNAME,
        password: getters.ENV.API_PASSWORD
      })
      .then(res => {
        const token = res.data.accessToken;

        $("#submissionForm").on("submit", function(_event) {
          _event.preventDefault();
          let _runner = document.forms["submissionForm"]["runner"].value;
          let _time = document.forms["submissionForm"]["time"].value;
          let _link = document.forms["submissionForm"]["link"].value;

          let _platform = document.forms["submissionForm"]["platform"].value;
          let _ruleset = document.forms["submissionForm"]["ruleset"].value;
          let _weapon = document.forms["submissionForm"]["weapon"].value;
          let _quest = document.forms["submissionForm"]["quest"].value;

          const parse = parser();
          function parser() {
            const statusObject = { status: 0 };
            if (_runner == null || _runner == "") {
              $("#is-runner-blank").css("display", "block");
              $("#runner-text-field").addClass("is-danger");
              statusObject.status = 0;
            }
            if (_time == null || _time == "") {
              $("#is-time-blank").css("display", "block");
              $("#time-text-field").addClass("is-danger");
              statusObject.status = 0;
            }
            if (_link == null || _link == "") {
              $("#is-link-blank").css("display", "block");
              $("#link-text-field").addClass("is-danger");
              statusObject.status = 0;
            }
            if (
              _runner != null &&
              _runner != "" &&
              _time != null &&
              _time != "" &&
              _link != null &&
              _link != ""
            ) {
              statusObject.status = 1;
            }
            _runner = _runner.toString().substring(0, 64);
            _time = _time.toString().substring(0, 64);
            _link = _link.toString().substring(0, 64);
            return statusObject;
          }

          if (parse.status == 1) {
            for (const i in self.bans) {
              if (
                _runner.toString() == self.bans[i]["name"] ||
                arrayUtils.toURL(_runner.toString().toLowerCase()) ==
                  self.bans[i]["url"]
              )
                return;
            }

            const data = {
              name: _runner,
              id: self.generateAuthToken(16),
              time: _time,
              link: _link,
              platform: _platform,
              ruleset: _ruleset,
              weapon: _weapon,
              quest: _quest
            };

            axios
              .post(getters.URL.API_LEADERBOARD_SUBMISSIONS, data, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
              .then(() => {
                $("#submissionForm").each(function() {
                  this.reset();
                });
              })
              .catch(() => {});
          }
        });

        fetch(getters.URL.API_LEADERBOARD_BANS_ALL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => response.json())
          .then(result => {
            this.bans = result;
          });

        fetch(getters.URL.API_LEADERBOARD_DATA, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => response.json())
          .then(result => {
            this.leaderboard.rise_platforms = result.rise.platforms;
            this.leaderboard.rise_rulesets = result.rise.rulesets;
            this.leaderboard.rise_weapons = result.rise.weapons;
            this.leaderboard.rise_quests = result.rise.quests;
          });
      });
  }
};
</script>
