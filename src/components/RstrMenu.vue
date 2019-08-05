<template>


<v-sheet elevation="6">
  <v-tabs
    background-color="cyan darken-2"
    dark
    next-icon="fas fa-chevron-right"
    prev-icon="fas fa-chevron-left"
    show-arrows
    v-model="loc_index"
    v-on:change="getMenus"
    class="fixed-tabs-bar"
  >
    <v-tabs-slider color="yellow"></v-tabs-slider>

    <v-tab
      v-for="place in places"
      :key="place"
    >
     {{ place }}
    </v-tab>

    <v-tabs-items>
      <v-tab-item
        v-for="place in places"
        :key="place"
      >
        
   
        
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>




  <v-tabs
          background-color="cyan"
          dark
          next-icon="fas fa-chevron-right"
          prev-icon="fas fa-chevron-left"
          show-arrows
          class="fixed-tabs-bar2"
          v-model="date_index"
        >
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab
            v-for="date in dates"
            :key="date"
            
            
          >
          {{ date }}
          </v-tab>

          <v-tabs-items>
            <v-tab-item
              v-for="date in dates"
              :key="date"

            >
          
        
           
        </v-tab-item>
      </v-tabs-items>    
    </v-tabs>



     <!-- 카드 삽입구간 -->
    <v-container fluid grid-list-md>
      <v-data-iterator
        :items="sktl_menu[date_index]"
        :items-per-page.sync="itemsPerPage"
        :footer-props="{ itemsPerPageOptions }"
        hide-default-footer
      >

        <template v-slot:default="props">
          <v-layout wrap>
          <v-flex
            v-for="item in props.items"
            :key="item.name"
            xs12
            sm6
            md4
            lg3
          >
            <v-card :loading="loading">
              <v-card-title><h4>{{ item.name }}</h4></v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content class="align-center">{{ item.menu1 }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="align-center">{{ item.menu2 }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="align-center">{{ item.menu3 }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="align-center">{{ item.menu4 }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="align-center">{{ item.menu5 }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="align-center">{{ item.menu6 }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="align-center">{{ item.menu7 }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </template>
    </v-data-iterator>
  </v-container>
<!-- 카드 삽입구간 끝 -->

</v-sheet>
</template>

<script>
import { getMenuData } from '../api/index.js'

  export default {
    data () {
      return {
        text: 'Lorem ipsum dolor sit amet, .',
        loading: false,
        places: ['남산', '보라매'],
        dates: ['월요일', '화요일', '수요일', '목요일', '금요일'],
        date_index:0,
        loc_index:0,
        itemsPerPageOptions: [3, 6, 9],
        itemsPerPage: 3,
        sktl_menu: [],

      }
    },
    methods: {
      getMenus: function() {
        var vm = this;
        this.loading=true;

        getMenuData({ tel_num: this.$store.state.user.tel_num, 
                      token: this.$store.state.token,
                      loc: this.loc_index === 0 ? 'N' : 'B'})
          .then((response) => {
            console.log(response);
            if (response.data.success) {
              console.log("success");
              vm.sktl_menu = response.data.data;
              vm.date_index = 0;
              this.loading=false;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }

    },
    // beforeUpdate() {
    //   this.getMenus();
    // }
    created() {
      this.getMenus();
    }
  }
</script>

<style>
.v-divider {
  margin-top: 0;
  margin-bottom: 0;
}
.v-card__title{
  justify-content: center;
}
.v-list-item__content{
  justify-content: center;
}
.fixed-tabs-bar {
  position: -webkit-sticky;
  position: sticky;
  top: 3.5rem;
  z-index: 2;
}
.fixed-tabs-bar2 {
  position: -webkit-sticky;
  position: sticky;
  top: 6.5rem;
  z-index: 2;
}
</style>
