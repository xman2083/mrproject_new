<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon @click="drawer = !drawer" class="blue--text" v-show="isLoggedIn"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase blue--text">
        <span class="font-weight-light">SK</span>
        <span>telink</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat color="blue" v-if="!isLoggedIn">
        login
        <router-link to="/login"></router-link>
      </v-btn>
      <v-btn flat v-else v-on:click="logout">
        <span class="mr-2">Logout</span>
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" class="white" temporary width="200px;">
      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="item in items" :key="item.title" @click router :to="item.route">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
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
        { title: "Home", icon: "home", route: "/" },
        { title: "회의실예약", icon: "event", route: "/meetingroombtn" },
        { title: "공지사항", icon: "info", route: "/notice" },
        { title: "식단표", route: "/RstrMenu" }
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
    this.$store.commit("SET_USER", JSON.parse(getUserFromCookie()));
    this.$store.commit("SET_TOKEN", getAuthFromCookie());
  }
};
</script>