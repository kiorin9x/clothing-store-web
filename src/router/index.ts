import { createRouter, createWebHistory } from "vue-router";
import layout from "../layout/MainLayout.vue";
import Login from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/product",
      component: layout,
      children: [
        {
          path: "product",
          component: () => import("../views/ProductList.vue"),
        },
        {
          path: "test",
          component: () => import("../views/test.vue"),
        },
        {
          path: "product/:id",
          component: () => import("../views/ProductDetail.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const guestPage = ["/home", "/login"];
  const authRequired = !guestPage.includes(to.path);
  const loggedIn = localStorage.getItem("token");

  if (authRequired && !loggedIn) {
    return next("/login");
  }
  if (loggedIn && to.path == "/login") {
    return next("/");
  }
  next();
});
export default router;
