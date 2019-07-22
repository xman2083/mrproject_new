import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
import MeetingRoomBtn from '../views/MeetingRoomBtn';
import Login from '../views/Login.vue';

// import { getUserFromCookie } from '../utils/cookies.js';
import noticeView from '../views/noticeView.vue';
import mainView from '../views/mainView.vue';


Vue.use(Router)

export default new Router({
  routes: [
    
    {
      path: '/',
      name: 'main',
      component: mainView,
      beforeEnter(to, from, next) {
        store.getters['isLoggedIn'] ? next() : next('/login');
      },
    },

      {
        path: '/meetingroombtn',
        name: 'meetingroombtn',
        component: MeetingRoomBtn,
        beforeEnter(to, from, next) {
          store.getters['isLoggedIn'] ? next() : next('/login');
        },
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
      beforeEnter(to, from, next) {
        store.getters['isLoggedIn'] ? next() : next('/login');
      },
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