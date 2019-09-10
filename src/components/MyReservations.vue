<template>
  <div>
    <v-card class="ma-5" hover max-width="600">
      <v-card-title>
        <span style="font-size:1.2rem; color:#364f6b !important">
          <v-icon size="15" class="pa-1" color="#364f6b">fas fa-check</v-icon>나의 예약 리스트
        </span>
      </v-card-title>
      <v-divider class="ml-5 mr-5"></v-divider>
      <v-list flat>
        <v-list-item-group v-for="(item,i) in myrsv" :key="i" no-action>
          <v-list-item>
            <v-list-item-avatar @click="show(item)">
              <v-avatar v-if="item[12] == '0' || item[12] == '1'" color="#3fc1c9" size="40">
                <span class="white--text" style="font-size:small;">반복</span>
              </v-avatar>
              <v-avatar v-else color="#364f6b" size="40">
                <span
                  class="white--text"
                  style="font-size:small;"
                >{{item[5].replace(/(.{2})/g,"$1-").substring(6,11)}}</span>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-icon></v-icon>
              <v-list-item-title v-text="item[1]"></v-list-item-title>
              <v-list-item-subtitle>{{item[3].replace(/(.{2})/g,"$1:").substring(0,5)}} ~ {{item[4].replace(/(.{2})/g,"$1:").substring(0,5)}} | {{item[7]}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-btn color="#fc5185" small dark depressed>
                <span style="font-size:smaller" @click="cnclCheck(item)">취소</span>
              </v-btn>&nbsp;&nbsp;
              <v-btn color="#364f6b" small dark depressed>
                <span style="font-size:smaller">상세</span>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
          <v-divider inset class="mr-5"></v-divider>
        </v-list-item-group>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <rsv-popup-form></rsv-popup-form>
    <v-dialog v-model="loadingSnackBar" hide-overlay transition="false" persistent width="200">
      <v-card color="#f5f5f5" dark width="200" height="50">
        <v-card-title color="white" class="justify-center">
          <v-progress-linear
            v-if="!completeSnackBar"
            indeterminate
            color="#3fc1c9"
            height="6"
            rounded
            class="mt-1"
          ></v-progress-linear>
          <v-icon v-else style="text-align:center" size="25" color="#3fc1c9">fas fa-check-circle</v-icon>
        </v-card-title>
      </v-card>
    </v-dialog>
    <v-dialog v-model="unavailable_reservation" persistent max-width="250px">
      <modal :alert_detail="alert_detail" @closeModal="closeModal"></modal>
    </v-dialog>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapState } from "vuex";
import { RsvDataApi } from "../api";
import RsvPopupForm from "./RsvPopupForm.vue";
import Modal from "./Modal.vue";
import { log } from "util";

export default {
  data() {
    return {
      loadingSnackBar: false,
      completeSnackBar: false,
      alert_detail: { type: "", message: "" },
      unavailable_reservation: false,
      rsv_temp: {},
      rsvInput: {
        date: "",
        user_id: "",
        user_name: "",
        telNum: "",
        room_id: "",
        rsv_id: "",
        rsv_created: "",
        room_name: "",
        floor_id: "",
        title: "",
        content: "",
        stHour: 0,
        edHour: 0,
        rsv_type: "",
        rsv_typedtl: "",
        st_dt: "",
        ed_dt: ""
      },

      rsvorg: {
        date: "",
        user_id: "",
        user_name: "",
        telNum: "",
        room_id: "",
        rsv_id: "",
        rsv_created: "",
        room_name: "",
        floor_id: "",
        title: "",
        content: "",
        stHour: 0,
        edHour: 0,
        rsv_type: "",
        rsv_typedtl: "",
        st_dt: "",
        ed_dt: ""
      }
    };
  },
  components: {
    RsvPopupForm,
    Modal
  },
  methods: {
    show(item) {
      console.log(item);
    },
    formatDate() {
      let d = new Date();
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      let year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("");
    },

    clearRsv() {
      this.rsvInput = {
        date: "",
        user_id: "",
        user_name: "",
        telNum: "",
        room_id: "",
        rsv_id: "",
        rsv_created: "",
        room_name: "",
        floor_id: "",
        title: "",
        content: "",
        stHour: 0,
        edHour: 0,
        rsv_type: "",
        rsv_typedtl: "",
        st_dt: "",
        ed_dt: ""
      };
    },

    cnclCheck(item) {
      this.unavailable_reservation = true;
      this.alert_detail = {
        type: "check",
        message: "예약을 취소하시겠습니까?"
      };
      Object.assign(this.rsv_temp, item);
      // console.log("!@@@@@@@",this.rsv_temp);
    },

    cnclReservation() {
      let rsv = {};
      Object.assign(rsv, this.rsv_temp);
      this.rsvInput.room_id = rsv[0];
      this.rsvInput.title = rsv[1];
      this.rsvInput.content = rsv[2];
      this.rsvInput.stHour = rsv[3];
      this.rsvInput.edHour = rsv[4];
      this.rsvInput.date = rsv[5];
      this.rsvInput.user_id = this.$store.state.user.user_id;
      this.rsvInput.user_name = rsv[8];
      this.rsvInput.telNum = rsv[9];
      this.rsvInput.rsv_created = rsv[10];
      this.rsvInput.rsv_type = rsv[12];
      this.rsvInput.rsv_typeftl = rsv[13];
      this.rsvInput.st_dt = rsv[5];
      this.rsvInput.ed_dt = rsv[15];

      this.loadingSnackBar = true;

      // console.log("@@@@@", this.rsvInput);
      RsvDataApi({
        tel_num: this.$store.state.user.tel_num,
        token: this.$store.state.token,
        rsvdata: this.rsvInput,
        httpMethod: "DELETE"
      })
        .then(response => {
          console.log(response);
          this.fetchRsvData();
          this.clearRsv();
          this.rsv_temp = {};

          setTimeout(() => {
            this.loadingSnackBar = false;
            this.completeSnackBar = true;
          }, 300);
        })
        .catch(error => {
          this.loadingSnackBar = false;
          console.log(error);
          this.unavailable_reservation = true;
          this.alert_detail = {
            type: "Error",
            message: "취소 오류가 발생했습니다."
          };
        });
    },

    fetchRsvData() {
      this.$store.dispatch("GETMYRSV", {
        tel_num: this.$store.state.user.tel_num,
        token: this.$store.state.token,
        user: this.$store.state.user
      });
    },
    closeModal(check) {
      this.unavailable_reservation = false;
      this.alert_detail.type = "";
      this.alert_detail.message = "";
      if (check) {
        this.cnclReservation();
      }
    }
  },
  async created() {
    let date = await this.formatDate();
    await this.$store.commit("SET_TODAY", date);
    console.log(date);
    await this.fetchRsvData();
    await this.$store.dispatch("GETUSER", {
      tel_num: this.$store.state.user.tel_num,
      token: this.$store.state.token
    });
  },

  computed: {
    ...mapState(["myrsv"])
  },

  watch: {
    loadingSnackBar(val) {
      val &&
        setTimeout(() => {
          this.loadingSnackBar = false;
        }, 5000);
    },
    completeSnackBar(val) {
      val &&
        setTimeout(() => {
          this.completeSnackBar = false;
        }, 300);
    }
  }
};
</script>

<style>
</style>
