import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/about",
		name: "About",
		component: () => import("../views/About.vue"),
	},
	{
		path: "/quests",
		name: "Quests",
		component: () => import("../views/Quests.vue"),
	},
	{
		path: "/quests/:id",
		component: () => import("../views/Quest.vue"),
	},
	{
		path: "/runners",
		name: "Users",
		component: () => import("../views/Users.vue"),
	},
	{
		path: "/runners/:id",
		component: () => import("../views/User.vue"),
	},
	{
		path: "/submissions",
		name: "Submissions",
		component: () => import("../views/Submissions.vue"),
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("../views/Login.vue"),
	},
	{
		path: "/dashboard",
		name: "Dashboard",
		component: () => import("../views/Dashboard.vue"),
	},
	{
		path: "/404",
		name: "NotFound",
		component: () => import("../views/NotFound.vue"),
	},
	{
		path: '/:pathMatch(.*)',
		redirect: { name: 'NotFound' }
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
