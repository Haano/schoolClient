//commit 11.02.2022 10:19
import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";

Vue.config.productionTip = false;
console.log("kek");
new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
