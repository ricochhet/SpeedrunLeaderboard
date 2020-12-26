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
    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        const users = [];

        for (const i in result) {
          result[i]["url"] = this.toURL(result[i]["name"].toLowerCase());
          users.push(result[i])
        }

        this.users = users;
    });
  }
};
</script>
  