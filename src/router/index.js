import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const route = createRouter({
  history: createWebHistory(),
  routes,
});

route.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem("token") || "";
  if (to.path === "/login") {
    if (token) return next("/welcome");
    next();
  }
  if (!token) {
    if (to.path !== "/login") {
      sessionStorage.setItem("redirect", to.fullPath);
    }

    next(`/login`);
  }
  next();
});
export default route;
