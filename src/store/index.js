import Vue from 'vue'
import Vuex from 'vuex'
import {
  loginUser,
  sendOtp
} from '../api';
import {
  saveAuthToCookie,
  saveUserToCookie,
  getUserFromCookie,
  deleteCookie
} from '../utils/cookies.js';
import guid from '../utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    token: '',
    rsvdata: {}
  },
  getters: {
    isLoggedIn(state) {
      return !!state.token || getUserFromCookie();
    },
    userToken(state) {
      return state.token;
    },
    userData(state) {
      return state.user;
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
    ADD_RSVDATA(state, payload) {
      state.rsvdata[payload.rsvdata.telNum] = payload.rsvdata
    },
    UPDATE_RSVDATA(state, payload) {
      state.rsvdata[payload.rsvdata.telNum] = payload.rsvdata
    },
    REMOVE_RSVDATA(state, payload) {
      Vue.delete(state.rsvdate, payload.rsvdata)
    },

  },
  actions: {
    async LOGIN({
      commit
    }, data) {
      const response = await loginUser(data);
      if (response.data.statusCode == 200) {
        commit('SET_USER', response.data.user);
        commit('SET_TOKEN', response.data.token);
        saveUserToCookie(JSON.stringify(response.data.user));
        saveAuthToCookie(response.data.token);
      }
      return response;
    },
    async SENDOTP({
      commit
    }, data) {
      const response = await sendOtp(data);
      return response;
    },
    addRsvData({
      commit
    }, data) {
      commit('ADD_RSVDATA', {
        rsvdata: data
      });
    },
    updateRsvData({
      commit
    }, data) {
      commit('UPDATE_RSVDATA', {
        rsvdata: data
      });
    },

    removeRsvData({
      commit
    }, data) {
      commit('DELETE_RSVDATA', {
        rsvdata: data
      });
    },
  },
})