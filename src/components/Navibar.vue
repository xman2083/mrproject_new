<template>
  <nav>
    <v-app-bar flat app>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="blue--text" v-show="isLoggedIn"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase blue--text">
        <span class="font-weight-light">SK</span>
        <span>telink</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="blue" v-if="!isLoggedIn">
        login
        <router-link to="/login"></router-link>
      </v-btn>
      <v-btn text v-else v-on:click="logout">
        <span class="mr-2">Logout</span>
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" class="white" temporary width="200px;">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">SKtelink</v-list-item-title>
          <v-list-item-subtitle>회의실예약</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item v-for="item in items"
        :key="item.title"
        router :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
import { getUserFromCookie, getAuthFromCookie } from "../utils/cookies.js";

export default {
  data() {
    return {
      drawer: false,
      items: [
        { title: "Home", icon: "fab fa-fort-awesome", route: "/" },
        { title: "회의실예약", icon: "fas fa-calendar-alt", route: "/meetingroombtn" },
        // { title: "공지사항", icon: "info", route: "/notice" },
        { title: "식단표", icon: "fas fa-utensils", route: "/RstrMenu" }
      ]
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"])
  },
  methods: {
    logout() {
      this.$store.commit("LOGOUT");
      this.$router.push("/login");
    }
  },
  created() {
    if (getUserFromCookie()) {
      this.$store.commit("SET_USER", JSON.parse(getUserFromCookie()));
      this.$store.commit("SET_TOKEN", getAuthFromCookie());
    }
  }
};
</script>