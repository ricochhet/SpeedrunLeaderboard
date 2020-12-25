import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import '../../node_modules/bulma/css/bulma.css';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../../node_modules/@fortawesome/fontawesome-free/js/all.js';
require("@/assets/main.scss");
require("@/assets/main.css")

createApp(App)
	.use(router)
	.mount("#app");
