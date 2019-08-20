<template>
  <v-card>
    <!-- <v-card-title>나의 예약 리스트</v-card-title>
    <v-subheader>REPORTS</v-subheader>
    <v-list-item-group v-model="item" color="primary">
      <v-list-item v-for="(item, i) in my_rsv_list" :key="i">
        <v-list-item-avatar>
          <v-btn></v-btn>

          <v-divider dense vertical></v-divider>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="item[1]"></v-list-item-title>
          <v-list-item-subtitle v-html="item[2]"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="indigo" dark @click="closePopup">닫기</v-btn>
    </v-card-actions>-->
    <!-- 
        this.rsvInput.title = rsv[1];
        this.rsvInput.content = rsv[2];
        this.rsvInput.stHour = rsv[3];
        this.rsvInput.edHour = rsv[4];
        this.rsvInput.rsv_id = rsv[6];
        this.rsvInput.rsv_created = rsv[10];
        this.rsvInput.user_name = rsv[8];
        this.rsvInput.telNum = rsv[9];
        this.rsvInput.date = rsv[5];
        this.rsvInput.room_id = rsv[0];
    -->
    <span>my rsv :</span>
    <v-btn @click="fetch">click</v-btn>
    {{ this.$store.state.myrsv }}
  </v-card>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
export default {
  methods: {
    ...mapMutations(["SET_TODAY"]),
    formatDate() {
      let d = new Date();
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      let year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("");
    },

    async fetch() {
      let date = await this.formatDate();
      await this.SET_TODAY(date);
      this.$store.dispatch("GETMYRSV", {
        tel_num: this.$store.state.user.tel_num,
        token: this.$store.state.token,
        user: this.$store.state.user
      });
    }
  }
};
</script>

<style>
</style>
