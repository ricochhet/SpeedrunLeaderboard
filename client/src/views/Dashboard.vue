<template>
  <div>
    <div class="m-6">
      <p class="is-size-3"><strong>VERIFICATION DASHBOARD</strong></p>
      <p>All user submissions will show up here.</p>
    </div>
    <div class="m-6" v-for="submission in submissions" :key="submission.name" id="submission">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            {{submission.name}} 
          </p><p class="m-3">{{submission.run.id}}</p>
          <!--<a href="#" class="card-header-icon" aria-label="more options">
            <span class="icon">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </a>-->
        </header>
        <div class="card-content">
          <div class="content">
            <strong>Quest: </strong> {{submission.run.quest_name}} <br>
            <strong>Weapon: </strong> {{submission.run.weapon}} <br>
            <strong>Time: </strong> {{submission.run.time}} <br>
            <strong>Platform: </strong> {{submission.run.platform}} <br>
            <strong>Ruleset: </strong> {{submission.run.ruleset}} <br>
            <strong>Quest: </strong> {{submission.run.quest_name}} <br>
            <strong>Link: </strong> <a :href=submission.run.link>{{submission.run.link}}</a>
            <!--<a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
            <br>
            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>-->
          </div>
        </div>
        <footer class="card-footer">
          <a class="card-footer-item" @click="approveSubmission(submission, submission.run.id)" id="approve-button">Approve</a>
          <a class="card-footer-item" @click="deleteSubmission(submission.run.id)" id="delete-button">Delete</a>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import axios from "axios";
import router from "../router";
const API_URL = "http://localhost:9000/api/leaderboard/submissions/all";

export default {
  name: "Dashboard",
  data: () => ({
    error: "",
    submissions: []
  }),
  methods: {
    getUserData: function() {
      axios.get("http://localhost:9000/api/user").then((response) => {
        console.log(response);
        console.log("Success");
      }).catch((errors) => {
        console.log(errors);
        console.log("Error");
        router.push("/");
      });
    },
    approveSubmission: function(data, id) {
      $(document).on("click", "#approve-button", function() {
        // Move up DOM tree until first incidence of .item-wrapper and remove
        $(this).closest("#submission").remove();
      });
      console.log('Approve submission');
      $.ajax({
        type: "POST",
        url: "http://localhost:9000/api/leaderboard/runners",
        data: JSON.stringify(data),
        success: function(response) {
          console.log(response);
        },
        dataType: "json",
        contentType : "application/json"
      });

      $.ajax({
        type: "DELETE",
        url: "http://localhost:9000/api/leaderboard/submissions",
        data: JSON.stringify({ id: id }),
        success: function(response) {
          console.log(response);
        },
        dataType: "json",
        contentType : "application/json"
      });
    },
    deleteSubmission: function(id) {
      $(document).on("click", "#delete-button", function() {
        // Move up DOM tree until first incidence of .item-wrapper and remove
        $(this).closest("#submission").remove();
      });
      console.log('Delete submission');
      $.ajax({
        type: "DELETE",
        url: "http://localhost:9000/api/leaderboard/submissions",
        data: JSON.stringify({ id: id }),
        success: function(response) {
          console.log(response);
        },
        dataType: "json",
        contentType : "application/json"
      });
    }
  },
  mounted() {
    this.getUserData();
    fetch(API_URL)
      .then(response => response.json())
      .then(result => {
        // Get each individual submission per user
        const userSubmissions = [];
        for (const i in result) {
          const name = result[i]["name"];
          const runs = result[i]["runs"];
          for (const k in runs) {
            userSubmissions.push({name: name, run: runs[k]});
          }
        }

        this.submissions = userSubmissions;
    });
  }
};
</script>