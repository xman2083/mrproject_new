import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
import Home from '../views/Home';
import Login from '../views/Login.vue';

// import { getUserFromCookie } from '../utils/cookies.js';
import noticeView from '../views/noticeView.vue';
import mainView from '../views/mainView.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter(to, from, next) {
        store.getters['isLoggedIn'] ? next() : next('/login');
      },
    },

    {
      path: '/main',
      name: 'main',
      component: mainView,
      },


    {
      path: '/calander',
      name: 'calander',
      component: Home,
      },


    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter(to, from, next) {
        store.getters['isLoggedIn'] ? next('/') : next();
      },
    },
    {
      path: '/notice',
      name: 'notice',
      component: noticeView,
      },
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