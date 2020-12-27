<template>
  <div class="content">
    <ul class="is-lower-alpha">
      <h3>1★ Monsters:</h3>
      <li v-for="monster in monsters.rank_one" :key="monster.name">
        <a :href="'/monsters/' + monster.id + '/all/all/all'">{{
          monster.primary_monster
        }}</a>
      </li>

      <h3>2★ Monsters:</h3>
      <li v-for="monster in monsters.rank_two" :key="monster.name">
        <a :href="'/monsters/' + monster.id + '/all/all/all'">{{
          monster.primary_monster
        }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
import getters from "../utils/getters";

export default {
  name: "Monsters",
  data: () => ({
    error: "",
    monsters: []
  }),
  mounted() {
    axios
      .post(getters.URL.API_AUTH_LOGIN, {
        username: getters.ENV.API_USERNAME,
        password: getters.ENV.API_PASSWORD
      })
      .then(res => {
        const token = res.data.accessToken;

        fetch(getters.URL.API_RISE_MONSTERS, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => response.json())
          .then(result => {
            const object = {
              rank_one: [],
              rank_two: []
            };

            for (const i in result) {
              if (result[i].rank == 1) object.rank_one.push(result[i]);
              if (result[i].rank == 2) object.rank_two.push(result[i]);
            }

            this.monsters = object;
          });
      });
  }
};
</script>
