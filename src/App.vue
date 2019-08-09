<template>
  <v-app>
    <Navibar />
    <v-content>
      <router-view></router-view>
    </v-content>
    <Footer />
  </v-app>
  </template>

<script>
import { mapGetters } from "vuex";
import Navibar from "./components/Navibar.vue";
import Footer from './components/Footer.vue';

export default {
  name: "App",
  components: { Navibar, Footer },
  data() {
    return {};
  }
};
</script>
