import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './routes'
import store from './store'
import './registerServiceWorker'
import localforage from 'localforage'
import VueResource from 'vue-resource'

Vue.config.productionTip = false

localforage.config({
  name: 'budgeterbium'
});

Vue.use(VueResource)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');