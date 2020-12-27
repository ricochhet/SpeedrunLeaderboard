<template>
  <div class="m-6">
    <!--<div v-if="user.status == 404">
      <h1 class="is-size-4">Oops! That user doesn't appear to exist!</h1>
    </div>-->
    <div>
    <!--<div v-else-if="user.status != 404">-->
      <!--<h1><strong>{{ $route.params.id }}</strong></h1>-->
      <h1 class="is-size-4"><strong>{{ user.name }}</strong></h1>
      <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
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
          <tr v-for="run in user.runs" :key="run.quest">
            <td>{{ user.name }}</td>
            <td><a :href="run.link">{{ run.time }}</a></td>
            <td>{{ run.weapon }}</td>
            <td>{{ run.platform }}</td>
            <td>{{ run.quest }}</td>
            <td>{{ run.ruleset }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "User",
  data: () => ({
    error: "",
    user: []
  }),
  mounted() {
    axios.post("http://localhost:9000/login", { username: "admin", password: "admin" }).then((res) => {
      const token = res.data.accessToken;

      // API_URL is placed here because it needs to reference the params
      const API_URL = "http://localhost:9000/api/leaderboard/runners/" + this.$route.params.id;

      fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(result => {
          this.user = result;
      });
    });
  }
};
</script>