import Vue from 'vue'
import Vuex from 'vuex'
import { loginUser, sendOtp } from '../api';
import { saveAuthToCookie, saveUserTelNumToCookie, saveUserIdToCookie,
  saveUserNameToCookie, getUserFromCookie, deleteCookie } from '../utils/cookies.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    token: '',
  },
  getters: {
    isLoggedIn(state) {
      return !!state.token || getUserFromCookie();
    },
    userToken(state) {
      return state.token;
    },
    userInfo(state) {
      if (state.token) 
        return state.token;
      else return getUserFromCookie();
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      deleteCookie('til_auth');
      deleteCookie('til_user');
    },
  },
  actions: {
    async LOGIN({ commit }, data) {
      const response = await loginUser(data);
      if (response.data.statusCode == 200) {
        commit('SET_USER', response.data.user);
        commit('SET_TOKEN', response.data.token);
        saveUserTelNumToCookie(response.data.user.tel_num);
        saveUserIdToCookie(response.data.user.user_id);
        saveUserNameToCookie(response.data.user.user_name);
        saveAuthToCookie(response.data.token);
      }
      return response;
    },
    async SENDOTP({ commit }, data) {
      const response = await sendOtp(data);
      return response;
    },
  },
})
