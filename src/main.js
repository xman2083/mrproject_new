import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { router } from './routes/index.js'

Vue.use(Vuetify);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
