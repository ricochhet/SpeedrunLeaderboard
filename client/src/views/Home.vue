<template>
  <div>
    Home
  </div>
</template>

<script>
const API_URL = "http://localhost:9000/api/leaderboard/runners/all";
import axios from "axios";

export default {
  name: "Home",
  data: () => ({
    error: "",
    runners: []
  }),
  mounted() {
    axios.post("http://localhost:9000/login", { username: "admin", password: "admin" }).then((res) => {
      const token = res.data.accessToken;

      fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
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
  