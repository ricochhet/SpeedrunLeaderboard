<template>
  <div>
    Home
  </div>
</template>

<script>
const API_URL = "http://localhost:9000/api/leaderboard/runners/all";

export default {
  name: "Home",
  data: () => ({
    error: "",
    runners: []
  }),
  mounted() {
    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        this.runners = result;
    });
  }
};
</script>
  