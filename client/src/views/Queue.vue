<template>
  <div class="m-6">
    <div class="m-6">
      <p class="is-size-3"><strong>SUBMISSION QUEUE</strong></p>
      <p>All user submitted runs will show up here.</p>
    </div>
    <table
      class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
    >
      <thead>
        <tr>
          <th>Runner</th>
          <th>Time</th>
          <th>Weapon</th>
          <th>Platform</th>
          <th>Quest</th>
          <th>Ruleset</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="submission in submissions" :key="submission.name">
          <td>{{ submission.run.name }}</td>
          <td>
            <a :href="submission.run.link">{{ submission.run.time }}</a>
          </td>
          <td>{{ submission.run.weapon }}</td>
          <td>{{ submission.run.platform }}</td>
          <td>{{ submission.run.quest }}</td>
          <td>{{ submission.run.ruleset }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from "axios";
import getters from "../utils/getters";

export default {
  name: "Queue",
  data: () => ({
    error: "",
    submissions: []
  }),
  mounted() {
    axios
      .post(getters.URL.API_AUTH_LOGIN, {
        username: getters.ENV.API_USERNAME,
        password: getters.ENV.API_PASSWORD
      })
      .then(res => {
        const token = res.data.accessToken;

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
      });
  }
};
</script>
