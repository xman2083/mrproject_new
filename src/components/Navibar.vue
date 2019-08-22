<template>
  <nav>
    <v-app-bar flat app>
      <v-app-bar-nav-icon style="color:#364f6b" @click="drawer = !drawer" v-show="isLoggedIn"></v-app-bar-nav-icon>
      <v-toolbar style="margin-left:0px;" flat>
        <v-toolbar-title>
          <router-link
            :to="items[0].route"
            style="text-decoration:none; color:#364f6b; font-family: 'Caveat', cursive !important;"
          >
            <!-- <img class="mb-1 mr-2" style="width:20px;" src="../assets/logo2.png"></img> -->
            <span>LINKS</span>
            <!-- <span class="font-weight-light">SK</span>
            <span>telink</span>-->
          </router-link>
          <!-- <span style="color:#D8D8D8; font-style:italic; font-size:0.9rem;">us</span> -->
        </v-toolbar-title>
      </v-toolbar>
      <v-spacer></v-spacer>
      <v-btn text style="color:#364f6b" v-if="!isLoggedIn">
        login
        <router-link to="/login"></router-link>
      </v-btn>
      <v-btn x-small text v-else style="color:#364f6b" @click="logout">
        <span class="mr-0">Logout</span>
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" class="white" temporary width="200px;">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            style="color:#364f6b; font-family: 'Caveat', cursive !important;"
            class="title"
          >LINKS</v-list-item-title>
          <v-list-item-subtitle
            style="color:#364f6b; font-family: 'Caveat', cursive !important;"
          >V 1.0</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          style="color:#3fc1c9"
          v-for="item in items"
          :key="item.title"
          router
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon color="#364f6b">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-title style="color:#364f6b">{{ item.title }}</v-list-item-title>
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
        {
          title: "회의실예약",
          icon: "fas fa-calendar-alt",
          route: "/meetingroombtn"
        },
        {
          title: "나의 예약 보기",
          icon: "fas fa-clipboard-list",
          route: "/myreservations"
        },
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