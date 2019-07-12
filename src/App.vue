<template>
    <nav>
        <v-toolbar flat app>
            <v-toolbar-side-icon @click="drawer = !drawer" class="blue--text"></v-toolbar-side-icon>
            <v-toolbar-title class="text-uppercase blue--text">
                <span class="font-weight-light">SK</span>
                <span>telink</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-btn flat color="blue">
                <span> Login</span>
                <v-icon >exit_to_app</v-icon>
            </v-btn> -->

             <v-btn flat color="blue"
                    v-if="!isLoggedIn">
              <span>Login</span>
              <v-icon>exit_to_app</v-icon>
            <router-link to="/login">
          
            </router-link>
            </v-btn>
            <v-btn flat v-else v-on:click="logout">
              <span class="mr-2">Logout</span>
            </v-btn>


        </v-toolbar>

        <v-navigation-drawer app v-model="drawer" class="white" absolute temporary width=200px;>
          <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click=""
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
    </nav>
</template>

<script>
import { mapGetters } from 'vuex';


export default {
  name: 'App',
  data () {
    return {
      drawer : false,
      items: [
        {title:'Home', icon: 'home'},
        {title:'회의실예약',icon: 'event'},
        {title: '공지사항', icon:'info'}
      ]
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    logout() {
      this.$store.commit('LOGOUT');
      this.$router.push('/login');
    },
  }
}

</script>
