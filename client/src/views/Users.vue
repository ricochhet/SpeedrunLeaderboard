<template>
  <div class="content">
    <ul class="is-lower-alpha">
      <li v-for="user in users" :key="user.name">
        <a :href="'/runners/' + user.url">{{ user.name }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
import arrayUtils from "../utils/arrayUtils";
import getters from "../utils/getters";

export default {
  name: "Users",
  data: () => ({
    error: "",
    users: []
  }),
  mounted() {
    axios
      .post(getters.URL.API_AUTH_LOGIN, {
        username: getters.ENV.API_USERNAME,
        password: getters.ENV.API_PASSWORD
      })
      .then(res => {
        const token = res.data.accessToken;

        fetch(getters.URL.API_LEADERBOARD_RUNNERS_ALL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => response.json())
          .then(result => {
            const users = [];

            for (const i in result) {
              result[i]["url"] = arrayUtils.toURL(
                result[i]["name"].toLowerCase()
              );
              users.push(result[i]);
            }

            this.users = users;
          });
      });
  }
};
</script>
