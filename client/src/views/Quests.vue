<template>
  <div class="content">
    <ul class="is-lower-alpha">
      <h3>1★ Quests:</h3>
      <li v-for="quest in quests.rank_one" :key="quest.name">
        <a :href="'/quests/' + quest.id + '/all/all/all'">{{quest.name}}</a>
      </li>

      <h3>2★ Quests:</h3>
      <li v-for="quest in quests.rank_two" :key="quest.name">
        <a :href="'/quests/' + quest.id + '/all/all/all'">{{quest.name}}</a>
      </li>
    </ul>
  </div>
</template>
<script>
const API_URL = "http://localhost:9000/api/rise/quests";
import axios from "axios";

export default {
  name: "Quests",
  data: () => ({
    error: "",
    quests: []
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
          const object = {
            rank_one: [],
            rank_two: []
          }

          for (const i in result) {
            if (result[i].rank == 1) object.rank_one.push(result[i]);
            if (result[i].rank == 2) object.rank_two.push(result[i]);
          }

          this.quests = object;
      });
    });
  }
};
</script>