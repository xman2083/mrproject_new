import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
// import { getUserFromCookie } from '../utils/cookies.js';
import noticeView from '../views/noticeView.vue';
import main from '../components/main.vue';


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
    }
  ]
})
/*
function beforeEnter(to, from, next) {
  if (store.getters['isLoggedIn'] || getUserFromCookie()) {
		next();
	} else {
		alert('sign in please');
		next('/login');
	}
}*/