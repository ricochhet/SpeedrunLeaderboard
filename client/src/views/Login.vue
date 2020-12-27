<template>
  <div class="m-6">
    <p class="is-size-3"><strong>DASHBOARD LOGIN</strong></p>
    <p>
      Want to become a verifier? Contact me -
      <i class="fab fa-discord"></i> Ricochet#0001
    </p>
  </div>
  <form id="submissionForm">
    <div class="m-6" style="width:25%;">
      <div class="field">
        <label class="label" for="email">Email</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Text input"
            name="email"
            id="email-text-field"
            maxlength="64"
          />
        </div>
        <p class="help is-danger" id="is-email-blank" style="display:none;">
          This field cannot be blank!
        </p>
      </div>

      <div class="field">
        <label class="label" for="password">Password</label>
        <div class="control">
          <input
            class="input"
            type="password"
            placeholder="Text input"
            name="password"
            id="password-text-field"
            maxlength="64"
          />
        </div>
        <p class="help is-danger" id="is-password-blank" style="display:none;">
          This field cannot be blank!
        </p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" type="submit">Submit</button>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import $ from "jquery";
import axios from "axios";
import router from "../router";
import getters from "../utils/getters";

export default {
  name: "Login",
  data: () => ({
    error: ""
  }),
  mounted() {
    axios
      .post(getters.URL.API_AUTH_LOGIN, {
        username: getters.ENV.API_USERNAME,
        password: getters.ENV.API_PASSWORD
      })
      .then(res => {
        const token = res.data.accessToken;

        $("#submissionForm").on("submit", function(_event) {
          _event.preventDefault();
          let _email = document.forms["submissionForm"]["email"].value;
          let _password = document.forms["submissionForm"]["password"].value;

          const parse = parser();
          function parser() {
            const statusObject = { status: 0 };
            if (_email == null || _email == "") {
              $("#is-runner-blank").css("display", "block");
              $("#runner-text-field").addClass("is-danger");
              statusObject.status = 0;
            }
            if (_password == null || _password == "") {
              $("#is-time-blank").css("display", "block");
              $("#time-text-field").addClass("is-danger");
              statusObject.status = 0;
            }
            if (
              _email != null &&
              _email != "" &&
              _password != null &&
              _password != ""
            ) {
              statusObject.status = 1;
            }
            _email = _email.toString().substring(0, 64);
            _password = _password.toString().substring(0, 64);
            return statusObject;
          }

          const dataMap = new Map();
          const array = JSON.stringify($("#submissionForm").serializeArray());
          const store = JSON.parse(array);
          for (const i in store) {
            dataMap.set(store[i].name, store[i].value);
          }

          let userData = {
            email: dataMap.get("email"),
            password: dataMap.get("password")
          };

          if (parse.status == 1) {
            // Axios was used here for this specific post request because ajax returned 400 (bad requests)
            axios.defaults.withCredentials = true;
            axios.defaults.headers = {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:9001/",
              "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE"
            };
            axios
              .post(getters.URL.API_DASHBOARD_AUTH_LOGIN, userData, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              })
              .then(() => {
                router.push("/dashboard");
                $("#submissionForm").each(function() {
                  this.reset();
                });
              })
              .catch(() => {
                $("#submissionForm").each(function() {
                  this.reset();
                });
              });
          }
        });
      });
  }
};
</script>
