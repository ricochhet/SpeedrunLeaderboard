<template>
  <div class="content">
    <ul class="is-lower-alpha">
      <li v-for="user in users" :key="user.name">
        <a :href="'/runners/' + user.url">{{user.name}}</a>
      </li>
    </ul>
  </div>
</template>
<script>
const API_URL = "http://localhost:9000/api/leaderboard/runners/all";
import axios from "axios";

export default {
  name: "Users",
  data: () => ({
    error: "",
    users: []
  }),
  methods: {
    toURL: function (str) {
      return str
        .toLowerCase()
        .split(" ")
        .join("-")
        .split("'")
        .join("")
        .split('"')
        .join("")
        .split("(")
        .join("")
        .split(")")
        .join("");
    }
  },
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
          const users = [];

          for (const i in result) {
            result[i]["url"] = this.toURL(result[i]["name"].toLowerCase());
            users.push(result[i])
          }

          this.users = users;
      });
    });
  }
};
</script>
  