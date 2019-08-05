<template>
  <div>
    <v-tabs
      color="cyan darken-2"
      dark
      next-icon="fas fa-chevron-right"
      prev-icon="fas fa-chevron-left"
      show-arrows
    >
      <v-tabs-slider color="yellow"></v-tabs-slider>
      <v-tab v-for="place in places" :key="place">{{ place }}</v-tab>

      <v-tabs-items>
        <v-tab-item v-for="place in places" :key="place">
          <v-tabs
            v-if="place === '남산'"
            color="cyan"
            dark
            next-icon="fas fa-chevron-right"
            prev-icon="fas fa-chevron-left"
            show-arrows
          >
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-for="date_namsan in dates_namsan" :key="date_namsan">{{ date_namsan }}</v-tab>

            <v-tabs-items>
              <v-tab-item v-for="date_namsan in dates_namsan" :key="date_namsan">
                <!-- 카드 삽입구간 -->
                <v-container fluid grid-list-md>
                  <v-data-iterator
                    :items="namsan_monday"
                    :rows-per-page-items="rowsPerPageItems"
                    :pagination.sync="pagination"
                    v-if="date_namsan === dates_namsan[0]"
                    content-tag="v-layout"
                    hide-actions
                    row
                    wrap
                  >
                    <template v-slot:item="props">
                      <v-flex xs12 sm6 md4 lg3>
                        <v-card>
                          <v-card-title
                            class="subheading font-weight-bold align-center justify-center"
                          >{{ props.item.name }}</v-card-title>

                          <v-divider></v-divider>

                          <v-list dense>
                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu1 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu2 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu3 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu4 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu5 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu6 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu7 }}</v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-card>
                      </v-flex>
                    </template>
                  </v-data-iterator>

                  <v-data-iterator
                    :items="namsan_tuesday"
                    :rows-per-page-items="rowsPerPageItems"
                    :pagination.sync="pagination"
                    v-else-if="date_namsan === dates_namsan[1]"
                    content-tag="v-layout"
                    hide-actions
                    row
                    wrap
                  >
                    <template v-slot:item="props">
                      <v-flex xs12 sm6 md4 lg3>
                        <v-card>
                          <v-card-title
                            class="subheading font-weight-bold align-center justify-center"
                          >{{ props.item.name }}</v-card-title>

                          <v-divider></v-divider>

                          <v-list dense>
                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu1 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu2 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu3 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu4 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu5 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu6 }}</v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                              <v-list-tile-content class="align-center">{{ props.item.menu7 }}</v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-card>
                      </v-flex>
                    </template>
                  </v-data-iterator>
                </v-container>
                <!-- 카드 삽입구간 끝 -->
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>

          <v-tabs
            v-else-if="place === '보라매'"
            color="cyan"
            dark
            next-icon="fas fa-chevron-right"
            prev-icon="fas fa-chevron-left"
            show-arrows
          >
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-for="date_boramae in dates_boramae" :key="date_boramae">{{ date_boramae }}</v-tab>

            <v-tabs-items>
              <v-tab-item v-for="date_boramae in dates_boramae" :key="date_boramae"></v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <!-- 카드 삽입구간
    <v-container fluid grid-list-md>
      <v-data-iterator
        :items="namsan_monday"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        content-tag="v-layout"
        hide-actions
        row
        wrap
      >

        <template v-slot:item="props">
          <v-flex
            xs12
            sm6
            md4
            lg3
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold align-center justify-center">{{ props.item.name }}</v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content class="align-center">{{ props.item.menu1 }}</v-list-tile-content>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-content class="align-center">{{ props.item.menu2 }}</v-list-tile-content>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-content class="align-center">{{ props.item.menu3 }}</v-list-tile-content>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-content class="align-center">{{ props.item.menu4 }}</v-list-tile-content>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-content class="align-center">{{ props.item.menu5 }}</v-list-tile-content>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-content class="align-center">{{ props.item.menu6 }}</v-list-tile-content>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-content class="align-center">{{ props.item.menu7 }}</v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </template>

      </v-data-iterator>
    </v-container>
    카드 삽입구간 끝-->
    <!-- <v-card-text>{{ menus_namsan.Monday }}</v-card-text> -->
  </div>
</template>

<script>
import { getMenuData } from "../api/index.js";

export default {
  data() {
    return {
      text: "Lorem ipsum dolor sit amet, .",
      places: ["남산", "보라매"],
      dates_namsan: ["7/29(월)", "7/30(화)", "7/31(수)", "8/1(목)", "8/2(금)"],
      dates_boramae: [
        "7/29(월)보",
        "7/30(화)보",
        "7/31(수)보",
        "8/1(목)보",
        "8/2(금)보"
      ],
      namsans: ["namsan_monday", "namsan_tuesday"],
      rowsPerPageItems: [4, 8, 12],
      pagination: {
        rowsPerPage: 4
      },
      namsan_monday: [
        {
          name: "월요일 아침",
          menu1: "순두부찌개",
          menu2: "쌀밥",
          menu3: "계란후라이",
          menu4: "감자조림",
          menu5: "건파래볶음",
          menu6: "포기김치",
          menu7: "토스트*커피*숭늉"
        },
        {
          name: "월요일 점심",
          menu1: "쭈꾸미오징어볶음",
          menu2: "쌀밥",
          menu3: "소고기미역국",
          menu4: "비엔나케찹조림",
          menu5: "오이지",
          menu6: "포기김치",
          menu7: "매실차"
        },
        {
          name: "월요일 저녁",
          menu1: "소불고기덮밥",
          menu2: "장국",
          menu3: "새우까스",
          menu4: "우엉조림",
          menu5: "연두부샐러드",
          menu6: "포기김치",
          menu7: "레몬차"
        }
      ],
      namsan_tuesday: [
        {
          name: "화요일 아침",
          menu1: "김치국",
          menu2: "쌀밥",
          menu3: "햄전",
          menu4: "멸치볶음",
          menu5: "가지나물",
          menu6: "포기김치",
          menu7: "토스트*커피*숭늉"
        },
        {
          name: "화요일 점심",
          menu1: "닭매운찜",
          menu2: "쌀밥",
          menu3: "북어국",
          menu4: "어묵조림",
          menu5: "파래김구이",
          menu6: "포기김치",
          menu7: "복숭아아이스티"
        },
        {
          name: "화요일 저녁",
          menu1: "소불고기덮밥",
          menu2: "장국",
          menu3: "새우까스",
          menu4: "우엉조림",
          menu5: "연두부샐러드",
          menu6: "포기김치",
          menu7: "레몬차"
        }
      ]
    };
  },
  methods: {
    getMenus: function() {
      getMenuData({
        tel_num: this.$store.state.user.tel_num,
        token: this.$store.state.token
      })
        .then(response => {
          console.log(response);
          if (response.data.success) {
            console.log("success");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style>
.v-divider {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
