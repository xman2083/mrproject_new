import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './routes'
import store from './store'
import './registerServiceWorker'
import localforage from 'localforage'


Vue.config.productionTip = false

localforage.config({
  name: 'budgeterbium'
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');