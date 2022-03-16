import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: () => import("./components/Dashboard"),
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
      path: "/Dashboard",
      name: "Dashboard",
      component: () => import("./components/Dashboard"),
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
  ],
});
