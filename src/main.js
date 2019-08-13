import "es6-promise/auto";
import "idempotent-babel-polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./routes";
import store from "./store";
import "./registerServiceWorker";
import localforage from "localforage";
import VueResource from "vue-resource";
require("localforage-startswith");
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

localforage.config({
  name: "budgeterbium",
});

Vue.use(VueResource);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount("#app");
