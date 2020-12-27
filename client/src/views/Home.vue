<template>
  <div>
    Home
  </div>
</template>

<script>
import axios from "axios";
import getters from "../utils/getters";

export default {
  name: "Home",
  data: () => ({
    error: "",
    runners: []
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
            this.runners = result;
          });
      });
  }
};
</script>
