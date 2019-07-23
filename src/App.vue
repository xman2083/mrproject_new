<template>
  <v-app>
    <Navibar />
    <v-content>
      <router-view>

      </router-view>
    </v-content>
  </v-app>
    <!-- <nav>
        <v-toolbar flat app>
            <v-toolbar-side-icon @click="drawer = !drawer" class="blue--text" v-show="isLoggedIn"></v-toolbar-side-icon>
            <v-toolbar-title class="text-uppercase blue--text">
                <span class="font-weight-light">SK</span>
                <span>telink</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
             <v-btn flat color="blue"
                    v-if="!isLoggedIn">
            <router-link to="/login">
            </router-link>
            </v-btn>
            <v-btn flat v-else v-on:click="logout">
              <span class="mr-2">Logout</span>
              <v-icon>exit_to_app</v-icon> 
            </v-btn>

        </v-toolbar>

        <v-navigation-drawer app v-model="drawer" class="white"  temporary width=200px;>
          <v-list class="pt-0" dense>
        <v-divider></v-divider>
        
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click=""
          router :to="item.route"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
   
    <v-content>
            <router-view></router-view>
          </v-content>
    </nav>
 -->

</template>

<script>
import { mapGetters } from 'vuex';
import Navibar from './components/Navibar.vue';

export default {
  name: 'App',
  components: { Navibar },
  data () {
    return {

    }
  },
  // computed: {
  //   ...mapGetters(['isLoggedIn']),
  // },
  // methods: {
  //   logout() {
  //     this.$store.commit('LOGOUT');
  //     this.$router.push('/login');
  //   },
  // }
 
}

</script>
