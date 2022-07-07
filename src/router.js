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
    },
    {
      path: "/clubs",
      name: "Clubs",
      component: () => import("./components/Clubs"),
    },
    {
      path: "/tutorials/:id",
      name: "tutorial-details",
      component: () => import("./components/Tutorial"),
    },
    {
      path: "/findByClassID/:id",
      name: "get-classID",
      component: () => import("./components/Tutorial"),
    },
    {
      path: "/add",
      name: "add",
      component: () => import("./components/AddTutorial"),
    },
    {
      path: "/class",
      name: "class",
      component: () => import("./components/ClassList"),
    },
    {
      path: "/CreateStudent",
      name: "CreateStudent",
      component: () => import("./components/CreateStudent"),
    },
    {
      path: "/Categories",
      name: "Categories",
      component: () => import("./components/Categories"),
    },
    {
      path: "/CreateDate",
      name: "CreateDate",
      component: () => import("./components/CreateDate"),
    },

    {
      path: "/Statistic",
      name: "Statistic",
      component: () => import("./components/Statistic"),
    },
    {
      path: "/Receipt",
      name: "Receipt",
      component: () => import("./components/Receipt"),
    },
    {
      path: "/",
      name: "login",

      component: () => import("./components/login"),
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
