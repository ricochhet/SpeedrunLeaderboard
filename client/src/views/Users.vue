<template>
  <div class="content">
    <ul class="is-lower-alpha">
      <li v-for="user in users" :key="user.name">
        <a :href="'/runners/' + user.name.toLowerCase()">{{user.name}}</a>
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
  mounted() {
    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        this.users = result;
    });
  }
};
</script>
  