<template>
  <div class="m-6">
    <!--<div v-if="user.status == 404">
      <h1 class="is-size-4">Oops! That user doesn't appear to exist!</h1>
    </div>-->
    <div>
    <!--<div v-else-if="user.status != 404">-->
      <!--<h1><strong>{{ $route.params.id }}</strong></h1>-->
      <h1 class="is-size-4"><strong>{{ quest }}</strong></h1>
      <div class="m-1">
        <nav class="navbar" role="navigation" aria-label="main navigation" style="background-color:transparent;">
          <div class="navbar-brand">
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
              <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                  Weapons
                </a>
                <div class="navbar-dropdown">
                  <a :href="`/quests/${this.$route.params.name}/${weapon.url}/${this.$route.params.ruleset}/${this.$route.params.platform}`" class="dropdown-item" v-for="weapon in leaderboard.rise_weapons" :key="weapon.name">
                    {{ weapon.name }}
                  </a>
                </div>
              </div>
              <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                  Ruleset
                </a>
                <div class="navbar-dropdown">
                  <a class="navbar-item" :href="`/quests/${this.$route.params.name}/${this.$route.params.weapon}/${ruleset.url}/${this.$route.params.platform}`" v-for="ruleset in leaderboard.rise_rulesets" :key="ruleset.url">
                    {{ ruleset.name }}
                  </a>
                </div>
              </div>
              <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                  Platform / Console
                </a>
                <div class="navbar-dropdown">
                  <a class="navbar-item" :href="`/quests/${this.$route.params.name}/${this.$route.params.weapon}/${this.$route.params.ruleset}/${platform.url}`" v-for="platform in leaderboard.rise_platforms" :key="platform.url">
                    {{ platform.name }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
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
          <tr v-for="run in runs" :key="run.id">
            <td>{{ run.name }}</td>
            <td><a :href="run.link">{{ run.time }}</a></td>
            <td>{{ run.weapon }}</td>
            <td>{{ run.platform }}</td>
            <td>{{ run.quest}}</td>
            <td>{{ run.ruleset }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: "Quest",
  data: () => ({
    error: "",
    runs: [],
    leaderboard: {
      rise_platforms: [],
      rise_rulesets: [],
      rise_weapons: [],
      //rise_quests: []
    }
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
    // API_URL is placed here because it needs to reference the params
    const API_URL = `http://localhost:9000/api/rise/quests/${this.$route.params.name}/${this.$route.params.weapon}/${this.$route.params.ruleset}/${this.$route.params.platform}`;
    const API_URL_LEADERBOARD = `http://localhost:9000/api/leaderboard/leaderboard`;

    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        // We'll assume the first result has the quest name in it so we can easily reference it.
        this.quest = result[0]["quest"];
        this.runs = result;
    });

    fetch(API_URL_LEADERBOARD)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        const weapons = [];
        const platforms = [];
        const rulesets = [];

        weapons.push({
          url: this.toURL("all"),
          name: "All"
        });

        for (const i in result.rise.weapons) {
          weapons.push({
            url: this.toURL(result.rise.weapons[i].name),
            name: result.rise.weapons[i].name
          });
        }

        platforms.push({
          url: this.toURL("all"),
          name: "All"
        });

        for (const i in result.rise.platforms) {
          platforms.push({
            url: this.toURL(result.rise.platforms[i].name),
            name: result.rise.platforms[i].name
          });
        }

        rulesets.push({
          url: this.toURL("all"),
          name: "All"
        });

        for (const i in result.rise.rulesets) {
          rulesets.push({
            url: this.toURL(result.rise.rulesets[i].name),
            name: result.rise.rulesets[i].name
          });
        }

        this.leaderboard.rise_weapons = weapons;
        this.leaderboard.rise_platforms = platforms;
        this.leaderboard.rise_rulesets = rulesets;
        //this.leaderboard.rise_quests = result.rise.quests;
    });
  }
};
</script>