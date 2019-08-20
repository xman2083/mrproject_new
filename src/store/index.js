import Vue from "vue";
import Vuex from "vuex";
import { loginUser, sendOtp, getUserData, getMyRsvData } from "../api";
import {
  saveAuthToCookie,
  saveUserToCookie,
  getUserFromCookie,
  deleteCookie,
} from "../utils/cookies.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    token: "",
    rsvdata: {},
    room_src: [[[]]],
    holiday_data: {},
    myrsv: {},
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
    getRsvDataStore(state) {
      return state.rsvdata;
    },
    getEventDays(state) {
      return state.holiday_data;
    },
  },
  mutations: {
    SET_USER(state, user) {
      // console.log(state.user, user);
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_HOLIDAY_DATA(state, data) {
      state.holiday_data = data;
    },

    LOGOUT(state) {
      state.user = null;
      state.token = null;
      deleteCookie("til_auth");
      deleteCookie("til_user");
    },

    SET_MY_RSV(state, myrsv) {
      state.myrsv = myrsv;
    },

    SET_TODAY(state, date) {
      state.user["date"] = date;
    },

    LOAD_ROOMDATA(state, payload) {
      console.log(payload);
      // 부끄러운 코드들 총집합... -.-;; by tabasco
      let uniq = [];
      let roomset = [];

      for (let i = 0; i < payload.data.group.length; i++) {
        let floor = payload.data.group[i][2];
        uniq.push(floor);
      }

      roomset = Array.from(new Set(uniq));

      // console.log(roomset);

      for (let i = 0; i < roomset.length; i++) {
        state.room_src[i] = [roomset[i], []];
      }

      let uniq2 = [];
      let roomset2 = [];

      for (let i = 0; i < payload.data.group.length; i++) {
        let room_key = payload.data.group[i][0];
        uniq2.push(room_key);
      }

      roomset2 = Array.from(new Set(uniq2));

      let room = {};

      for (let i = 0; i < roomset2.length; i++) {
        let floor = payload.data.group[i][2];
        room[floor] = [];
      }

      for (let i = 0; i < roomset2.length; i++) {
        let room_key = payload.data.group[i][0];
        let room_name = payload.data.group[i][1];
        let floor = payload.data.group[i][2];

        room[floor].push([room_name, room_key]);
      }
      // console.log(room);

      for (let i = 0; i < state.room_src.length; i++) {
        state.room_src[i][1] = room[state.room_src[i][0]];
      }
    },
  },
  actions: {
    async LOGIN({ commit }, data) {
      const response = await loginUser(data);
      // alert("login data:", response.data.user);
      if (response.data.statusCode == 200) {
        commit("SET_USER", response.data.user);
        commit("SET_TOKEN", response.data.token);
        let user_cookie = {};
        user_cookie["user_id"] = response.data.user.user_id;
        user_cookie["tel_num"] = response.data.user.tel_num;
        saveUserToCookie(JSON.stringify(user_cookie));
        saveAuthToCookie(response.data.token);
      }
      return response;
    },
    async SENDOTP({ commit }, data) {
      const response = await sendOtp(data);
      return response;
    },
    loadRoomSrc(state, roomsrc) {
      console.log("(store) >> loadRoomSrc commit...");
      state.commit("LOAD_ROOMDATA", roomsrc);
    },
    async GETUSER({ commit }, data) {
      const response = await getUserData(data);
      console.log("user data:", response);
      if (response.data.statusCode == 200) {
        let user = {};
        user["user_id"] = response.data.user[0][0];
        user["user_name"] = response.data.user[0][1];
        user["tel_num"] = response.data.user[0][2];
        user["user_team"] = response.data.user[0][3];
        commit("SET_USER", user);
      }
    },
    async GETMYRSV({ commit }, data) {
      const response = await getMyRsvData(data);
      console.log("my rsv:", response);
      if (response.data.statusCode == 200) {
        commit("SET_MY_RSV", data);
      }
    },
  },
});
