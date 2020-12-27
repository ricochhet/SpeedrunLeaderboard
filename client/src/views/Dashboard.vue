<template>
  <div class="m-6">
    <div class="m-6">
      <p class="is-size-4"><strong>PENDING VERIFICATION</strong></p>
      <p>Submissions that are pending verification.</p>
    </div>
    <table
      class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
    >
      <thead>
        <tr>
          <th>Runner</th>
          <th>Weapon</th>
          <th>Link</th>
          <th>Platform</th>
          <th>Ruleset</th>
          <th>Quest</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="submission in submissions"
          :key="submission.name"
          id="submission"
        >
          <td>{{ submission.name }}</td>
          <td>{{ submission.run.weapon }}</td>
          <td>
            <a :href="submission.run.link">{{ submission.run.time }}</a>
          </td>
          <td>{{ submission.run.platform }}</td>
          <td>{{ submission.run.ruleset }}</td>
          <td>{{ submission.run.quest }}</td>
          <td>
            <a
              class="button is-primary m-1"
              @click="
                approveSubmission(
                  submission,
                  submission.run.id,
                  submission.run.name
                )
              "
              id="approve-button"
              >Approve</a
            >
            <a
              class="button is-warning m-1"
              @click="deleteSubmission(submission.run.id, submission.run.name)"
              id="delete-button"
              >Delete</a
            >
            <a
              class="button is-danger m-1"
              @click="banUser(submission.run.id, submission.run.name)"
              id="ban-button"
              >Ban</a
            >
          </td>
        </tr>
      </tbody>
    </table>

    <div class="m-6">
      <p class="is-size-4"><strong>VERIFIED RUNS</strong></p>
      <p>Already verified submissions.</p>
    </div>
    <table
      class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
    >
      <thead>
        <tr>
          <th>Runner</th>
          <th>Weapon</th>
          <th>Link</th>
          <th>Platform</th>
          <th>Ruleset</th>
          <th>Quest</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="runner in runners" :key="runner.name" id="runner">
          <td>{{ runner.name }}</td>
          <td>{{ runner.run.weapon }}</td>
          <td>
            <a :href="runner.run.link">{{ runner.run.time }}</a>
          </td>
          <td>{{ runner.run.platform }}</td>
          <td>{{ runner.run.ruleset }}</td>
          <td>{{ runner.run.quest }}</td>
          <td>
            <a
              class="button is-warning m-1"
              @click="deleteExisting(runner.run.id, runner.run.name)"
              id="delete-button"
              >Delete</a
            >
            <a
              class="button is-danger m-1"
              @click="banExisting(runner.run.id, runner.run.name)"
              id="ban-button"
              >Ban</a
            >
          </td>
        </tr>
      </tbody>
    </table>
    <!--<div class="m-6" v-for="submission in submissions" :key="submission.name" id="submission">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            {{submission.name}} 
          </p><p class="m-3">{{submission.run.id}}</p>
          <a class="button is-danger m-1" @click="banUser(submission.run.id, submission.run.name)" id="ban-button">
            Ban
          </a>
        </header>
        <div class="card-content">
          <div class="content">
            <strong>Name: </strong> {{submission.name}} <br>
            <strong>Weapon: </strong> {{submission.run.weapon}} <br>
            <strong>Time: </strong> {{submission.run.time}} <br>
            <strong>Platform: </strong> {{submission.run.platform}} <br>
            <strong>Ruleset: </strong> {{submission.run.ruleset}} <br>
            <strong>Quest: </strong> {{submission.run.quest}} <br>
            <strong>Link: </strong> <a :href=submission.run.link>{{submission.run.link}}</a>
          </div>
        </div>
        <footer class="card-footer">
          <a class="card-footer-item" @click="approveSubmission(submission, submission.run.id, submission.run.name)" id="approve-button">Approve</a>
          <a class="card-footer-item" @click="deleteSubmission(submission.run.id, submission.run.name)" id="delete-button">Delete</a>
        </footer>
      </div>
    </div>-->
  </div>
</template>
<script>
import $ from "jquery";
import axios from "axios";
import router from "../router";
import arrayUtils from "../utils/arrayUtils";
import getters from "../utils/getters";

export default {
  name: "Dashboard",
  data: () => ({
    error: "",
    submissions: [],
    runners: [],
    leaderboard: {
      rise_platforms: [],
      rise_rulesets: [],
      rise_weapons: []
      //rise_quests: []
    },
    bans: []
  }),
  methods: {
    getUserData: function() {
      axios
        .get(getters.URL.API_DASHBOARD_AUTH_USER)
        .then(res => {
          console.log(res);
        })
        .catch(() => {
          router.push("/");
        });
    },
    approveSubmission: function(data, id, name) {
      $(document).on("click", "#approve-button", function() {
        // Move up DOM tree until first incidence of .item-wrapper and remove
        $(this)
          .closest("#submission")
          .remove();
      });

      axios
        .post(getters.URL.API_AUTH_LOGIN, {
          username: getters.ENV.API_USERNAME,
          password: getters.ENV.API_PASSWORD
        })
        .then(res => {
          const token = res.data.accessToken;

          $.ajax({
            type: "POST",
            url: getters.URL.API_LEADERBOARD_RUNNERS,
            data: JSON.stringify(data),
            success: function() {},
            dataType: "json",
            contentType: "application/json",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          $.ajax({
            type: "DELETE",
            url: getters.URL.API_LEADERBOARD_SUBMISSIONS,
            data: JSON.stringify({ id: id, name: name }),
            success: function() {},
            dataType: "json",
            contentType: "application/json",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        });
    },
    deleteSubmission: function(id, name) {
      $(document).on("click", "#delete-button", function() {
        // Move up DOM tree until first incidence of .item-wrapper and remove
        $(this)
          .closest("#submission")
          .remove();
      });

      axios
        .post(getters.URL.API_AUTH_LOGIN, {
          username: getters.ENV.API_USERNAME,
          password: getters.ENV.API_PASSWORD
        })
        .then(res => {
          const token = res.data.accessToken;

          $.ajax({
            type: "DELETE",
            url: getters.URL.API_LEADERBOARD_SUBMISSIONS,
            data: JSON.stringify({ id: id, name: name }),
            success: function() {},
            dataType: "json",
            contentType: "application/json",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        });
    },
    banUser: function(id, name) {
      $(document).on("click", "#ban-button", function() {
        // Move up DOM tree until first incidence of .item-wrapper and remove
        $(this)
          .closest("#submission")
          .remove();
      });

      axios
        .post(getters.URL.API_AUTH_LOGIN, {
          username: getters.ENV.API_USERNAME,
          password: getters.ENV.API_PASSWORD
        })
        .then(res => {
          const token = res.data.accessToken;

          $.ajax({
            type: "POST",
            url: getters.URL.API_LEADERBOARD_BANS,
            data: JSON.stringify({ name: name }),
            success: function() {},
            dataType: "json",
            contentType: "application/json",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          $.ajax({
            type: "DELETE",
            url: getters.URL.API_LEADERBOARD_SUBMISSIONS,
            data: JSON.stringify({ id: id, name: name }),
            success: function() {},
            dataType: "json",
            contentType: "application/json",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        });
    },
    deleteExisting: function(id, name) {
      $(document).on("click", "#delete-button", function() {
        // Move up DOM tree until first incidence of .item-wrapper and remove
        $(this)
          .closest("#runner")
          .remove();
      });

      axios
        .post(getters.URL.API_AUTH_LOGIN, {
          username: getters.ENV.API_USERNAME,
          password: getters.ENV.API_PASSWORD
        })
        .then(res => {
          const token = res.data.accessToken;

          $.ajax({
            type: "DELETE",
            url: getters.URL.API_LEADERBOARD_RUNNERS,
            data: JSON.stringify({ id: id, name: name }),
            success: function() {},
            dataType: "json",
            contentType: "application/json",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        });
    },
    banExisting: function(id, name) {
      $(document).on("click", "#ban-button", function() {
        // Move up DOM tree until first incidence of .item-wrapper and remove
        $(this)
          .closest("#runner")
          .remove();
      });

      axios
        .post(getters.URL.API_AUTH_LOGIN, {
          username: getters.ENV.API_USERNAME,
          password: getters.ENV.API_PASSWORD
        })
        .then(res => {
          const token = res.data.accessToken;

          $.ajax({
            type: "POST",
            url: getters.URL.API_LEADERBOARD_BANS,
            data: JSON.stringify({ name: name }),
            success: function() {},
            dataType: "json",
            contentType: "application/json",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          $.ajax({
            type: "DELETE",
            url: getters.URL.API_LEADERBOARD_RUNNERS,
            data: JSON.stringify({ id: id, name: name }),
            success: function() {},
            dataType: "json",
            contentType: "application/json",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        });
    }
  },
  mounted() {
    this.getUserData();

    axios
      .post(getters.URL.API_AUTH_LOGIN, {
        username: getters.ENV.API_USERNAME,
        password: getters.ENV.API_PASSWORD
      })
      .then(res => {
        const token = res.data.accessToken;

        fetch(getters.URL.API_LEADERBOARD_DATA, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => response.json())
          .then(result => {
            const weapons = [];
            const platforms = [];
            const rulesets = [];

            weapons.push({
              url: arrayUtils.toURL("all"),
              name: "All"
            });

            for (const i in result.rise.weapons) {
              weapons.push({
                url: arrayUtils.toURL(result.rise.weapons[i].name),
                name: result.rise.weapons[i].name
              });
            }

            platforms.push({
              url: arrayUtils.toURL("all"),
              name: "All"
            });

            for (const i in result.rise.platforms) {
              platforms.push({
                url: arrayUtils.toURL(result.rise.platforms[i].name),
                name: result.rise.platforms[i].name
              });
            }

            rulesets.push({
              url: arrayUtils.toURL("all"),
              name: "All"
            });

            for (const i in result.rise.rulesets) {
              rulesets.push({
                url: arrayUtils.toURL(result.rise.rulesets[i].name),
                name: result.rise.rulesets[i].name
              });
            }

            this.leaderboard.rise_weapons = weapons;
            this.leaderboard.rise_platforms = platforms;
            this.leaderboard.rise_rulesets = rulesets;
            //this.leaderboard.rise_quests = result.rise.quests;
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

        fetch(getters.URL.API_LEADERBOARD_SUBMISSIONS_ALL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => response.json())
          .then(result => {
            // Get each individual submission per user
            const userSubmissions = [];
            for (const i in result) {
              const name = result[i]["name"];
              const runs = result[i]["runs"];
              for (const k in runs) {
                userSubmissions.push({ name: name, run: runs[k] });
              }
            }

            this.submissions = userSubmissions;
          });

        fetch(getters.URL.API_LEADERBOARD_RUNNERS_ALL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => response.json())
          .then(result => {
            // Get each individual submission per user
            const userRuns = [];
            for (const i in result) {
              const name = result[i]["name"];
              const runs = result[i]["runs"];
              for (const k in runs) {
                userRuns.push({ name: name, run: runs[k] });
              }
            }

            this.runners = userRuns;
          });
      });
  }
};
</script>
