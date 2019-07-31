import Vue from "vue";
import Vuex from "vuex";
import { loginUser, sendOtp } from "../api";
import {
  saveAuthToCookie,
  saveUserToCookie,
  getUserFromCookie,
  deleteCookie,
} from "../utils/cookies.js";
import { guid } from "../utils";
import { removeRsvData, saveRsvData, fetchRsvData } from "../api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    token: "",
    rsvdata: {},
    room_src: {},
    // room_src: [
    //   [
    //     "16층",
    //     [
    //       "몽블랑",
    //       "킬리만자로",
    //       "남산",
    //       "티티카카",
    //       "아차산",
    //       "한라산",
    //       "A",
    //       "B",
    //     ],
    //     0,
    //   ],
    //   [
    //     "17층",
    //     ["1회의실", "2회의실", "3회의실", "4회의실", "5회의실", "6회의실"],
    //     1,
    //   ],
    //   ["2층", ["접견실"], 2],
    //   ["보라매", ["하와이", "발리", "몰디브", "8층 회의실", "개발실"], 3],
    //   [
    //     "빔-남산",
    //     [
    //       "빔1",
    //       "빔2",
    //       "빔3",
    //       "무선 MIC1",
    //       "무선 MIC2",
    //       "무선 Pin MIC",
    //       "Class Cam",
    //     ],
    //     4,
    //   ],
    //   ["빔-보라매", ["빔1", "빔2"], 5],
    // ],
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
    getRsvData(state) {
      return state.rsvdata;
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
      deleteCookie("til_auth");
      deleteCookie("til_user");
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
      state.rsvdata = {};
    },
    LOAD_ROOMSRCDATA(state, payload) {
      state.room_src = payload;
    },
  },
  actions: {
    async LOGIN({ commit }, data) {
      const response = await loginUser(data);
      if (response.data.statusCode == 200) {
        commit("SET_USER", response.data.user);
        commit("SET_TOKEN", response.data.token);
        saveUserToCookie(JSON.stringify(response.data.user));
        saveAuthToCookie(response.data.token);
      }
      return response;
    },
    async SENDOTP({ commit }, data) {
      const response = await sendOtp(data);
      return response;
    },

    addRsvData({ commit }, data) {
      let id = guid();
      let rsvdata = Object.assign(
        {
          id: id,
        },
        data
      ); // copy the data into a new object with the generated ID
      commit("ADD_RSVDATA", {
        rsvdata: rsvdata,
      });
      saveRsvData(rsvdata).then(value => {
        // we've saved the account, what now?
      });
    },

    updateRsvData({ commit }, data) {
      commit("UPDATE_RSVDATA", {
        rsvdata: data,
      });
      saveRsvData(data);
    },

    deleteRsvData({ commit }, data) {
      commit("DELETE_RSVDATA", {
        rsvdata: data,
      });
      removeRsvData(data);
    },

    async loadRsvData(state) {
      // 로딩 되어 있지 않은 경우만 실행
      if (!state.rsvdata || Object.keys(state.rsvdata).length === 0) {
        return fetchRsvData().then(res => {
          let rsvdata = {};
          Object.keys(res).forEach(key => {
            rsvdata[res[key].id] = res[key];
          });
          state.commit("LOAD_RSVDATA", rsvdata);
        });
      }
    },
    async loadRoomSrcData(state) {
      if (!state.room_src || Object.keys(state.room_src).length === 0) {
        return;
      }
    },
  },
});
