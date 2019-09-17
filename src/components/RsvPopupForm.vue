<template>
  <div>
    <v-card v-if="this.dialog" id="modal">
      <v-card-title>
        <v-avatar color="#3fc1c9" size="40">
          <span
            class="white--text"
            style="font-size:small;"
          >{{this.$store.state.room_src[room_indx][0]}}</span>
        </v-avatar>
        <span
          class="headline"
          style="color:grey !important;"
        >&nbsp;&nbsp;{{this.currCell[0].name}}&nbsp;&nbsp;</span>
        <!-- <span class="grey--text subtitle-1">{{this.date}}</span> -->
        <!-- <span class="grey--text subtitle-1">{{this.rsvInput}}</span> -->
        <!-- <span class="grey--text subtitle-1">{{this.rept_rsv}}</span> -->
        <!-- <v-btn @click="convertRept">click</v-btn> -->
      </v-card-title>

      <v-divider style="margin:0px;"></v-divider>
      <v-card-text style="padding:0;">
        <v-container grid-list-md>
          <!-- 해당 시간에 예약이 안되어 있는 경우 -->
          <v-layout v-if="reserved === false" wrap>
            <v-flex style="align-content:center;" xs3>
              <v-btn
                style="color:#364f6b !important"
                block
                large
                color="#f5f5f5"
                disabled
                max-width="200"
              >시작</v-btn>
            </v-flex>
            <v-flex xs9>
              <vue-timepicker
                hide-disabled-hours
                :hour-range="[[8,20]]"
                :minute-interval="30"
                style="color:#364f6b; padding: 0px;width:200px; font-size:20px;"
                hide-clear-button
                v-model="cell_time.st"
              ></vue-timepicker>
            </v-flex>
            <v-flex xs3>
              <v-btn
                style="color:#364f6b !important"
                block
                large
                color="#f5f5f5"
                disabled
                max-width="200"
              >종료</v-btn>
            </v-flex>
            <v-flex xs9>
              <vue-timepicker
                :hour-range="[[8,20]]"
                hide-disabled-hours
                :minute-interval="30"
                style="color:#364f6b; padding: 0px;width:200px; font-size:20px;"
                hide-clear-button
                v-model="cell_time.et"
              ></vue-timepicker>
            </v-flex>

            <v-flex xs6 sm6 md6>
              <v-text-field
                color="#fc5185"
                label="예약자 성명*"
                v-model="rsvInput.user_name"
                required
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md6>
              <v-text-field
                color="#fc5185"
                label="휴대폰 번호"
                v-model="rsvInput.telNum"
                required
                readonly
                v-mask="mask"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm12 md12>
              <v-text-field
                v-if="dialog"
                color="#fc5185"
                autofocus
                required
                label="회의 주제*"
                v-model="rsvInput.title"
                :rules="[rules.required, rules.counter]"
                counter
                maxlength="25"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field color="#fc5185" label="회의 내용" v-model="rsvInput.content" clearable></v-text-field>
            </v-flex>
             <v-flex xs12 sm12 md12>
              <v-autocomplete
                v-if="dialog"
                color="#fc5185"
                autofocus
                label="참석자"
                v-model="rsvInput.attendees"
                :items="attend"
                multiple
                item-text="name"
                item-value="name"
                chips
                >
              
              </v-autocomplete>
                
            </v-flex>
            <v-checkbox v-model="checkbox" @change="onRept" label="반복 예약" color="#3fc1c9"></v-checkbox>
            <v-expansion-panels v-if="checkbox" accordion v-model="panel">
              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }" class="pt-0 pb-0">
                  <v-radio-group v-model="rept_rsv.rsv_type" row>
                    <v-radio label="매일" value="0" color="#3fc1c9"></v-radio>
                    <v-radio label="매주" value="1" color="#3fc1c9"></v-radio>
                  </v-radio-group>
                </v-expansion-panel-header>
                <v-expansion-panel-content v-if="rept_rsv.rsv_type == 1">
                  <v-row>
                    <!-- {{rept_rsv.rsv_typedtl}} -->
                    <v-checkbox
                      v-for="i in day"
                      v-model="rept_rsv.rsv_typedtl"
                      :label="i.text"
                      :value="i.value"
                      :key="i.text"
                      color="#3fc1c9"
                      class="ml-2 mt-0 mb-0 pb-0"
                    ></v-checkbox>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }">
                  <v-row no-gutters>
                    <v-col cols="3">기간</v-col>
                    <v-col cols="9" class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <span v-if="open">종료일자를 선택해주세요</span>
                        <v-row v-else no-gutters style="width: 100%">
                          <v-col cols="6">
                            <div class="d-none d-sm-inline">시작일:</div>
                            {{ rept_rsv.st_dt || 'Not set' }}
                          </v-col>
                          <v-col cols="6">
                            <div class="d-none d-sm-inline">종료일:</div>
                            {{ rept_rsv.ed_dt || 'Not set' }}
                          </v-col>
                        </v-row>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row justify="space-around" no-gutters>
                    <v-col cols="6">
                      <v-menu
                        ref="startMenu"
                        :close-on-content-click="false"
                        :return-value.sync="rept_rsv.st_dt"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="rept_rsv.st_dt"
                            label="시작일"
                            prepend-icon="event"
                            disabled
                            v-on="on"
                          ></v-text-field>
                        </template>
                      </v-menu>
                    </v-col>

                    <v-col cols="6">
                      <v-menu
                        v-model="open_picker"
                        :close-on-content-click="false"
                        :return-value.sync="rsvInput.ed_dt"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="rept_rsv.ed_dt"
                            label="종료일"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="rept_rsv.ed_dt"
                          no-title
                          scrollable
                          :events="dateFunctionEvents"
                          @input="open_picker = false"
                        >
                          <v-spacer></v-spacer>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-layout>

          <!-- 해당 시간에 예약이 되어 있는 경우 -->
          <v-layout v-if="reserved === true" wrap>
            <v-flex xs3>
              <v-btn
                style="color:#364f6b !important"
                block
                large
                color="#f5f5f5"
                disabled
                max-width="200"
              >시작</v-btn>
            </v-flex>
            <v-flex xs9>
              <vue-timepicker
                :hour-range="[[8,20]]"
                hide-disabled-hours
                :minute-interval="30"
                style="color:#364f6b; padding: 0px;width:200px; font-size:20px;"
                hide-clear-button
                v-model="cell_time.st"
                :disabled="!owner"
              ></vue-timepicker>
            </v-flex>
            <v-flex xs3>
              <v-btn
                style="color:#364f6b !important"
                block
                large
                color="#f5f5f5"
                disabled
                max-width="200"
              >종료</v-btn>
            </v-flex>
            <v-flex xs9>
              <vue-timepicker
                :hour-range="[[8,20]]"
                hide-disabled-hours
                :minute-interval="30"
                style="color:#364f6b; padding: 0px;width:200px; font-size:20px;"
                hide-clear-button
                v-model="cell_time.et"
                :disabled="!owner"
              ></vue-timepicker>
            </v-flex>
            <v-flex xs6 sm6 md4>
              <v-text-field
                color="#fc5185"
                label="예약자 성명*"
                v-model="rsvInput.user_name"
                required
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 md4>
              <v-text-field
                color="#fc5185"
                label="휴대폰 번호"
                v-model="rsvInput.telNum"
                readonly
                v-mask="mask"
              ></v-text-field>
            </v-flex>
            <v-flex xs8></v-flex>
            <v-flex offset-xs9 offset-md9>
              <a :href="`tel:${ this.rsvInput.telNum }`">
                <v-btn small v-if="!owner" color="#364f6b" depressed dark>전화하기</v-btn>
              </a>
            </v-flex>

            <v-flex xs12 sm12 md12>
              <v-text-field
                v-if="dialog"
                :autofocus="!reserved"
                required
                label="회의 주제*"
                color="#fc5185"
                v-model="rsvInput.title"
                :clearable="owner"
                :readonly="!owner"
                :rules="[rules.required, rules.counter]"
                counter
                maxlength="25"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                label="회의 내용"
                color="#fc5185"
                v-model="rsvInput.content"
                :clearable="owner"
                :readonly="!owner"
              ></v-text-field>
            </v-flex>

            <v-checkbox
              xs4
              sm6
              d-flex
              v-model="checkbox"
              @change="onRept"
              label="반복 예약"
              color="#3fc1c9"
              disabled
            ></v-checkbox>
            <v-expansion-panels v-if="checkbox" accordion v-model="panel">
              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }" class="pt-0 pb-0">
                  <v-radio-group v-model="rept_rsv.rsv_type" row>
                    <v-radio :disabled="!owner" label="매일" value="0" color="#3fc1c9"></v-radio>
                    <v-radio :disabled="!owner" label="매주" value="1" color="#3fc1c9"></v-radio>
                  </v-radio-group>
                </v-expansion-panel-header>
                <v-expansion-panel-content v-if="rept_rsv.rsv_type == 1" class="pb-0">
                  <v-row>
                    <!-- {{rept_rsv.rsv_typedtl}} -->
                    <v-checkbox
                      v-for="i in day"
                      v-model="rept_rsv.rsv_typedtl"
                      :label="i.text"
                      :value="i.value"
                      :key="i.text"
                      color="#3fc1c9"
                      class="ml-5 mt-0 mb-0 pb-0"
                      style="font-size:10px; !important"
                      :disabled="!owner"
                    ></v-checkbox>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header v-slot="{ open }">
                  <v-row no-gutters>
                    <v-col cols="3">기간</v-col>
                    <v-col cols="9" class="text--secondary">
                      <v-fade-transition leave-absolute>
                        <span v-if="open">종료일자를 선택해주세요</span>
                        <v-row v-else no-gutters style="width: 100%">
                          <v-col cols="6">
                            <div class="d-none d-sm-inline">시작일:</div>
                            {{ rept_rsv.st_dt || 'Not set' }}
                          </v-col>
                          <v-col cols="6">
                            <div class="d-none d-sm-inline">종료일:</div>
                            {{ rept_rsv.ed_dt || 'Not set' }}
                          </v-col>
                        </v-row>
                      </v-fade-transition>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row justify="space-around" no-gutters>
                    <v-col cols="6">
                      <v-menu
                        ref="startMenu"
                        :close-on-content-click="false"
                        :return-value.sync="rept_rsv.st_dt"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="rept_rsv.st_dt"
                            label="시작일"
                            prepend-icon="event"
                            disabled
                            v-on="on"
                          ></v-text-field>
                        </template>
                      </v-menu>
                    </v-col>

                    <v-col cols="6">
                      <v-menu
                        v-model="open_picker"
                        :close-on-content-click="false"
                        :return-value.sync="rsvInput.ed_dt"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="rept_rsv.ed_dt"
                            label="종료일"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                            :disabled="!owner"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="rept_rsv.ed_dt"
                          no-title
                          scrollable
                          @input="open_picker = false"
                          :events="dateFunctionEvents"
                        >
                          <v-spacer></v-spacer>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-layout>
          <small>*필수 입력 사항 입니다.</small>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn width="80" color="#f5f5f5" style="color:#364f6b" depressed @click="closeDialog">닫기</v-btn>
        <v-btn
          color="#fc5185"
          width="80"
          v-if="currCell !== '' && (currCell[1].reserved === 3) && owner"
          @click="cnclCheck('check')"
          depressed
          dark
        >예약 취소</v-btn>
        <v-btn
          v-if="currCell !== '' && (currCell[1].reserved === 3) && owner"
          color="#364f6b"
          dark
          width="80"
          depressed
          @click="updateReservation"
        >예약 수정</v-btn>
        <v-btn
          v-if="currCell !== '' && (currCell[1].reserved === 0)"
          color="#364f6b"
          dark
          width="80"
          depressed
          @click="makeReservation"
        >예약 하기</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="unavailable_reservation" persistent max-width="250px">
      <modal :alert_detail="alert_detail" @closeModal="closeModal"></modal>
    </v-dialog>
  </div>
</template>

<script>
import VueTimepicker from "vue2-timepicker";
import { mapGetters } from "vuex";
import { mask } from "vue-the-mask";
import Modal from "./Modal.vue";
import { getInfo } from '../api';

export default {
  data() {
    return {
      open_picker: false,
      reserved: false,
      rsv_temp: {},
      rpt_checker: true,
      owner: false,
      mask: "###-####-####",
      // converted_typedtl: [0, 0, 0, 0, 0],
      cell_time: {},
      alert_detail: { type: "", message: "" },
      unavailable_reservation: false,
      panel: [0],
      rules: {
        required: value => !!value || "필수입력 사항입니다.",
        counter: value => value.length <= 25 || "최대 25자까지 입력가능합니다."
      },

      items: [{ text: "매일", value: 0 }, { text: "매주", value: 1 }],
      day: [
        { text: "월", value: 2 },
        { text: "화", value: 3 },
        { text: "수", value: 4 },
        { text: "목", value: 5 },
        { text: "금", value: 6 }
      ],
      rept_rsv: {
        rsv_type: this.rsvInput.rsv_type || "0",
        rsv_typedtl: this.rsvInput.rsv_typedtl || [],
        st_dt: null,
        ed_dt: null
      },
      // rept_gbn: 0,
      checkbox: false,
      attend:[
          { header: 'Group 1' },
          { name: 'Sandra', group: 'Group 1' },
          { name: 'Ali Connors', group: 'Group 1' },
          { name: 'Trevor Hansen', group: 'Group 1' },
          { name: 'Tucker Smith', group: 'Group 1' },
          { divider: true },
          { header: 'Group 2' },
          { name: 'Britta Holt', group: 'Group 2' },
          { name: 'Jane Smith ', group: 'Group 2' },
          { name: 'John Smith', group: 'Group 2'},
          { name: 'Sandra', group: 'Group 2' },
        ],
    };
  },
  props: [
    "rsvInput",
    "room_indx",
    "date",
    "dialog",
    "currCell",
    "selected_time",
    "rsvDataRes"
  ],
  components: {
    VueTimepicker,
    Modal
  },

  directives: {
    mask
  },

  methods: {
    makeReservation() {
      var dtl_check = this.rept_rsv.rsv_typedtl.reduce(function(a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);
      if (
        (this.rept_rsv.rsv_type == 1 &&
          this.rept_rsv.rsv_typedtl.length == 0) ||
        (this.rept_rsv.rsv_type == 1 &&
          dtl_check[0] == 0 &&
          dtl_check.length == 1)
      ) {
        this.unavailable_reservation = true;
        this.alert_detail = {
          type: "error",
          message: "반복하실 요일을 선택해주세요."
        };
      } else {
        this.convertRept();
        console.log("rept:", this.rept_rsv.rsv_typedtl);
        this.$emit("makeReservation", this.cell_time, this.rept_rsv);
      }
    },

    updateReservation() {
      var dtl_check = this.rept_rsv.rsv_typedtl.reduce(function(a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);
      if (
        (this.rept_rsv.rsv_type == 1 &&
          this.rept_rsv.rsv_typedtl.length == 0) ||
        (this.rept_rsv.rsv_type == 1 &&
          dtl_check[0] == 0 &&
          dtl_check.length == 1)
      ) {
        this.unavailable_reservation = true;
        this.alert_detail = {
          type: "error",
          message: "반복하실 요일을 선택해주세요."
        };
      } else {
        this.convertRept();
        console.log("rept:", this.rept_rsv.rsv_typedtl);
        this.$emit("updateReservation", this.cell_time, this.rept_rsv);
      }
    },

    dateFunctionEvents(date) {
      if (this.$store.state.holiday_data.includes(date)) {
        return ["red"];
      }
      return false;
    },
    closeDialog() {
      this.checkbox = false;
      this.rpt_checker = true;
      this.clearRept();
      this.$emit("closeDialog");
      this.$emit("clearRsv");
    },
    closeModal(check) {
      this.unavailable_reservation = false;
      // this.alert_detail.type = "";
      // this.alert_detail.message = "";
      if (check === "check") {
        this.$emit("cnclReservation", this.rsvInput);
        this.clearRept();
      }
    },
    timeControl(val, cal) {
      this.$emit("timeControl", val, cal);
    },
    rsvAvailableCheck() {
      this.$emit("rsvAvailableCheck");
    },

    // timePicker(status) {
    //   this.$emit("timePicker", status);
    // }
    // onChgReptType() {
    //   this.rept_rsv.rsv_type = this.rept_gbn;
    // },
    // 체크 박스가 켜져 있고 rept에 시작 날짜가 없는 경우 시작날짜를 오늘로 설정, 종료일자를 일주일 후로 설정 함
    onRept() {
      if (this.checkbox && !this.rept_rsv.st_dt) {
        // this.rept_rsv.rsv_type = this.rept_gbn;
        this.rept_rsv.st_dt = this.date;

        //종료일자 default값 +7일로 지정
        let arr1 = this.date.split("-");
        arr1[1] = arr1[1] - 1;
        let dat1 = new Date(arr1[0], arr1[1], arr1[2]);

        this.rept_rsv.ed_dt = this.formatDate(dat1.setDate(dat1.getDate() + 7));
      } else {
        this.clearRept();
      }
    },
    clearRept() {
      this.checkbox = false;
      this.rept_rsv = {
        rsv_type: "0",
        rsv_typedtl: [],
        st_dt: null,
        ed_dt: null
      };
    },
    // 반복 예약 정보를 불러오는 메소드
    getRept() {
      this.rept_rsv.rsv_type = this.rsvInput.rsv_type || "0";
      if (this.rsvInput.rsv_typedtl) {
        this.rept_rsv.rsv_typedtl = JSON.parse(this.rsvInput.rsv_typedtl);
      }

      var st_dt = "";
      st_dt = this.rsvInput.st_dt;
      st_dt =
        st_dt.substring(0, 4) +
        "-" +
        st_dt.substring(4, 6) +
        "-" +
        st_dt.substring(6, 8);

      var ed_dt = "";
      ed_dt = this.rsvInput.ed_dt;
      ed_dt =
        ed_dt.substring(0, 4) +
        "-" +
        ed_dt.substring(4, 6) +
        "-" +
        ed_dt.substring(6, 8);

      this.rept_rsv.st_dt = this.rsvInput.st_dt ? st_dt : null;
      this.rept_rsv.ed_dt = this.rsvInput.ed_dt ? ed_dt : null;
      // 반복 예약 데이터가 있을 경우

      if (this.rsvInput.st_dt) {
        this.checkbox = true;
      }
    },

    cnclCheck(check) {
      this.unavailable_reservation = true;
      this.alert_detail = {
        type: check,
        message: "예약을 취소하시겠습니까?"
      };
    },

    formatDate(date) {
      if (date) {
        let d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
      } else {
        let d = new Date();
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
      }
    },


  },

  beforeUpdate() {
    this.owner = false;
    // console.log(this.currCell);
    // console.log("RsvPopupForm >> beforeUpdate");
    if (this.dialog) {
      if (
        this.currCell[1].reserved === 2 ||
        this.currCell[1].reserved === 3 ||
        this.currCell[1].reserved === 4
      ) {
        this.reserved = true;
      } else {
        this.reserved = false;
      }
      if (
        this.rsvInput.telNum.replace(/\-/g, "") ===
        this.$store.state.user.tel_num
      ) {
        this.owner = true;
      }
    }
    if (this.rpt_checker && this.dialog) {
      this.getRept();
      this.rpt_checker = false;
    }
  },
  mounted() {
    Object.assign(this.cell_time, this.selected_time);
    // console.log("RsvPopupForm >> mounted");
    // Close modal with 'esc' key
    document.addEventListener("keydown", e => {
      if (e.keyCode == 27) {
        this.clearRept();
        this.$emit("closeDialog");
        this.$emit("clearRsv");
        this.rpt_checker = true;
        this.open_picker = false;
      }
    });

    getInfo({
        tel_num: this.$store.state.user.tel_num,
        token: this.$store.state.token})
        .then(response => {
          console.log("info request");
          if (response.data.statusCode == 200) {
            this.attend = response.data.data.map(e => {
              return {
                name: e[0] + '-' + e[2]
              };
            });
          }  
          
        })
        .catch(error => {
            console.log(error);
          });;
  },
  watch: {
    dialog() {
      Object.assign(this.cell_time, this.selected_time);
    }
  }
};
</script>

<style>
</style>
