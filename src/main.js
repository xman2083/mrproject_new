import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './routes'
import store from './store'
import './registerServiceWorker'
import localforage from 'localforage'
<<<<<<< HEAD
import VueResource from 'vue-resource'
=======
require('localforage-startswith');
>>>>>>> 55b63233d292d01a43ef8b43feec32ac4ab9cab5

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