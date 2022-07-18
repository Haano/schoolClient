import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("./components/Dashboard"),
      meta: { keepAlive: true },
    },
    {
      path: "/clubs",
      name: "Clubs",
      component: () => import("./components/Clubs"),
      meta: { keepAlive: true },
    },

    {
      path: "/class",
      name: "class",
      component: () => import("./components/ClassList"),
      meta: { keepAlive: true },
    },
    {
      path: "/CreateStudent",
      name: "CreateStudent",
      component: () => import("./components/CreateStudent"),
      meta: { keepAlive: true },
    },
    {
      path: "/Categories",
      name: "Categories",
      component: () => import("./components/Categories"),
      meta: { keepAlive: true },
    },
    {
      path: "/CreateDate",
      name: "CreateDate",
      component: () => import("./components/CreateDate"),
      meta: { keepAlive: true },
    },

    {
      path: "/Statistic",
      name: "Statistic",
      component: () => import("./components/Statistic"),
      meta: { keepAlive: true },
    },
    {
      path: "/Receipt",
      name: "Receipt",
      component: () => import("./components/Receipt"),
      meta: { keepAlive: true },
    },
    {
      path: "/",
      name: "login",

      component: () => import("./components/login"),
      meta: { keepAlive: false },
    },
  ],
});

//let auth = true;

router.beforeEach((to, from, next) => {
  const currentUser = localStorage.getItem("user");
  console.log(currentUser, "currentUser", to.name, from.name);

  if (currentUser === null && to.name !== "login") {
    console.log(currentUser, "currentUser IFFFFFFFFF");
    next({ path: "/" });
    if (currentUser) {
      next(false);
    } else {
      next({ path: "/" });
    }
  } else {
    if (currentUser) {
      next();
    } else {
      next();
    }
  }

  // if (auth) {
  //     next("login");
  // } else {
  //     next("/");
  // }
});

export default router;
