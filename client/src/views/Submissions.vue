<template>
  <form id="submissionForm">
    <div class="m-6" style="width:25%;">
      <div class="field">
        <label class="label" for="runner">Runner (Name)</label>
        <div class="control">
          <input class="input" type="text" placeholder="Text input" name="runner" id="runner-text-field" maxlength="64">
        </div>
        <p class="help is-danger" id="is-runner-blank" style="display:none;">This field cannot be blank!</p>
      </div>

      <div class="field">
        <label class="label" for="time">Time</label>
        <div class="control">
          <input class="input" type="text" placeholder="Text input" name="time" id="time-text-field" maxlength="64">
        </div>
        <p class="help is-danger" id="is-time-blank" style="display:none;">This field cannot be blank!</p>
      </div>

      <div class="field">
        <label class="label" for="link">Link</label>
        <div class="control">
          <input class="input" type="text" placeholder="Text input" name="link" id="link-text-field" maxlength="64">
        </div>
        <p class="help is-danger" id="is-link-blank" style="display:none;">This field cannot be blank!</p>
      </div>

      <div class="field">
        <label class="label" for="platform">Platform</label>
        <div class="control">
          <div class="select">
            <select name="platform">
              <option v-for="platform in leaderboard.rise_platforms" :key="platform.name">{{ platform.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label" for="ruleset">Ruleset</label>
        <div class="control">
          <div class="select">
            <select name="ruleset">
              <option v-for="ruleset in leaderboard.rise_rulesets" :key="ruleset.name">{{ ruleset.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label" for="weapon">Weapon</label>
        <div class="control">
          <div class="select">
            <select name="weapon">
              <option v-for="weapon in leaderboard.rise_weapons" :key="weapon.name">{{ weapon.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label" for="quest">Quest</label>
        <div class="control">
          <div class="select">
            <select name="quest">
              <option v-for="quest in leaderboard.rise_quests" :key="quest.name">{{ quest.name }}</option>
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
const API_URL = "http://localhost:9000/api/leaderboard";
import $ from "jquery";

export default {
  name: "Submissions",
  data: () => ({
    error: "",
    leaderboard: {
      rise_platforms: [],
      rise_rulesets: [],
      rise_weapons: [],
      rise_quests: []
    }
  }),
  methods: {
    process() {

    }
  },
  mounted() {
    $("#submissionForm").on("submit", function(_event) {
      _event.preventDefault();
      let _runner = document.forms["submissionForm"]["runner"].value;
      let _time = document.forms["submissionForm"]["time"].value;
      let _link = document.forms["submissionForm"]["link"].value;

      const parse = parser();
      function parser() {
        const statusObject = {status: 0};
        if (_runner == null || _runner == "") { $("#is-runner-blank").css("display", "block"); $("#runner-text-field").addClass("is-danger"); statusObject.status = 0; }
        if (_time == null || _time == "") { $("#is-time-blank").css("display", "block"); $("#time-text-field").addClass("is-danger"); statusObject.status = 0; }
        if (_link == null || _link == "") { $("#is-link-blank").css("display", "block"); $("#link-text-field").addClass("is-danger"); statusObject.status = 0; }
        if (_runner != null && _runner != "" && _time != null && _time != "" && _link != null && _link != "") { statusObject.status = 1; }
        _runner = _runner.toString().substring(0, 64);
        _time = _time.toString().substring(0, 64);
        _link = _link.toString().substring(0, 64);
        return statusObject;
      }

      if (parse.status == 1) {
        console.log('test')
        $.ajax({
          type: "POST",
          url: "http://localhost:9000/api/submissions",
          data: JSON.stringify($("#submissionForm").serializeArray()),
          success: function(response) {
            console.log('test');
            console.log(response);
            $("#submissionForm").each(function () {
              this.reset();
            });
          },
          dataType: "text",
          contentType : "application/json"
        }); 
      }
    });

    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        this.leaderboard.rise_platforms = result.rise.platforms;
        this.leaderboard.rise_rulesets = result.rise.rulesets;
        this.leaderboard.rise_weapons = result.rise.weapons;
        this.leaderboard.rise_quests = result.rise.quests;
    });
  }
};
</script>
