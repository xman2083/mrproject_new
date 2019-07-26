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
import {
  guid
} from '../utils'
import {
  removeRsvData,
  saveRsvData,
  fetchRsvData,
} from '../api';

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
      state.rsvdata[payload.rsvdata.id] = payload.rsvdata;
    },
    UPDATE_RSVDATA(state, payload) {
      state.rsvdata[payload.rsvdata.id] = payload.rsvdata;
    },
    REMOVE_RSVDATA(state, payload) {
      Vue.delete(state.rsvdata, payload.rsvdata.id);
    },
    LOAD_RSVDATA(state, payload) {
      state.rsvdata = payload;
    },
    CLEAR_STOREDATA(state) {
      state.rsvdata = {}
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
      let id = guid();
      let rsvdata = Object.assign({
        id: id
      }, data); // copy the data into a new object with the generated ID
      commit('ADD_RSVDATA', {
        rsvdata: rsvdata
      });
      saveRsvData(rsvdata).then((value) => {
        // we've saved the account, what now?
      });
    },

    updateRsvData({
      commit
    }, data) {
      commit('UPDATE_RSVDATA', {
        rsvdata: data
      });
      saveRsvData(data);
    },

    deleteRsvData({
      commit
    }, data) {
      commit('DELETE_RSVDATA', {
        rsvdata: data
      });
      removeRsvData(data);
    },

    async loadRsvData(state) {
      // 로딩 되어 있지 않은 경우만 실행
      if (!state.rsvdata || Object.keys(state.rsvdata).length === 0) {
        return fetchRsvData().then((res) => {
          let rsvdata = {};
          Object.keys(res).forEach((key) => {
            rsvdata[res[key].id] = res[key];
          });
          state.commit('LOAD_RSVDATA', rsvdata);
        });
      }
    },

  },
})