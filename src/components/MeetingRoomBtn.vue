<template>
  <div :key="renderKey">
    <v-tabs
      @change="tabChanged"
      v-model="active"
      color="white"
      dark
      slider-color="yellow"
      show-arrows
    >
      <v-tab
        v-for="room in this.$store.state.room_src"
        @click="loadRsvStore"
        :key="room[2]"
        ripple
      >{{ room[0] }}</v-tab>
      <v-tab-item v-for="room in this.$store.state.room_src" :key="room[2]"></v-tab-item>
    </v-tabs>

    <v-layout>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-layout>
            <v-flex xs4 sm4 md2 lg2>
              <v-text-field v-model="date" prepend-icon="event" readonly v-on="on"></v-text-field>
            </v-flex>

            <v-flex xs8 sm8 md10 lg10>
              <v-btn small outlined color="#BDBDBD" @click="dateDecrement">◀ 이전일</v-btn>
              <v-btn small outlined color="#BDBDBD" @click="dateIncrement">다음일 ▶</v-btn>
            </v-flex>
          </v-layout>
        </template>
        <v-date-picker v-model="date" @input="menu = false" locale="ko-kr"></v-date-picker>
      </v-menu>
    </v-layout>
    <div>
      <div class="panel">
        <div class="panel-body">
          <div class="row">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>
                    <v-btn height="22" width="88" disabled>회의실</v-btn>
                  </th>

                  <th>
                    <div class="btn-group btn-group-justified flex-wrap">
                      <div class="btn-group mr-2" role="group" v-for="time in timeTable">
                        <button
                          type="button"
                          class="btn btn-primary"
                          style="background-color:grey;border-style:solid;border-width:1px;border-color:#ddd;box-shadow: 0px 0px 0px #ddd; padding:0px !important; border-round: 0px !important;"
                          disabled
                        >
                          <span
                            style="font-size: smaller; text-align: center; font-style:italic; padding:-2px 0px;"
                          >{{time}}</span>
                        </button>
                      </div>
                    </div>
                    <!-- <button type="button" class="btn btn-info btn-block">시간</button> -->
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="room,index in rooms[room_indx]">
                  <td>
                    <!-- <button type="button" class="btn btn-success btn-block">{{room.name}}</button> -->
                    <v-btn
                      @click="onRoomBtnClick(room)"
                      outlined
                      :style="roomBtn(room.name.length)"
                      :color="roomColorSet[index]"
                      width="88"
                    >{{room.name}}</v-btn>
                  </td>
                  <td style="vertical-align:middle !important">
                    <div class="btn-group btn-group-justified flex-wrap">
                      <div class="btn-group" v-for="hour in room.hours">
                        <!-- seleted 
                        0: 예약 안됨
                        1: 반만 예약됨
                        2: 내가 예약
                        3: 내가 반만 예약
                        4: 남이 예약-->
                        <button
                          type="button"
                          class="btn btn-block"
                          :style="roomColors(index,hour.border_left,hour.border_right,hour.index)"
                          :class="{ 'btn-bookedOthers': (hour.reserved ===4 ),
                                    'btn-bookedCell': (hour.reserved === 2 || hour.reserved === 3),
                                    'btn-info': (hour.reserved === 1),
                                    'btn-emptyCell': (hour.reserved === 0),
                                    'btn-clickedCell': (hour.selected) }"
                          @click="currRoom = room, cellClick(room, hour)"
                        >
                          <!-- <span
                            v-if="hour.border_right==='1px solid'"
                            style="font-size: 2px;"
                          >{{hour.name}}</span>-->

                          <v-card v-if="hour.border_left==='1px solid'" max-width="0" height="22">
                            <v-card-text style="padding:0px; font-size:2px !important;">
                              <br />
                              <!-- <v-icon size="5">people</v-icon> -->
                              {{ hour.name }}
                            </v-card-text>
                          </v-card>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- DB 테스트 부분 -->
    <v-btn color="indigo" small dark @click="clearAllData">예약DB삭제</v-btn>
    <v-btn color="grey" small dark @click="CLEAR_STOREDATA">스토어 삭제</v-btn>
    <v-btn color="warning" small dark @click="fetchRsvData">fetch</v-btn>
    <v-btn color="info" small dark @click="forceRerender">rerender:{{this.renderKey}}</v-btn>
    <div>
      <span style="color:red; font-size:5px;">{{this.$store.state.room_src}}</span>
    </div>
    {{this.selected_time}}
    <div>
      <span style="font-size:5px; background-color:yellow;">{{this.$store.state.user}}</span>
    </div>
    <div>{{this.$store.state.rsvdata}}</div>

    <!-- 회의실 예약 팝업, dialog가 true 일 경우만 노출 -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <rsv-popup-form
        :rsvInput="rsvInput"
        :room_indx="room_indx"
        :date="date"
        :dialog="dialog"
        :currCell="currCell"
        :currRoom="currRoom"
        :rooms="rooms"
        :selected_time="selected_time"
        @closeDialog="closeDialog"
        @makeReservation="makeReservation"
        @cnclReservation="cnclReservation"
        np
        @updateReservation="updateReservation"
        @updateRsv="updateRsv"
        @clearRsv="clearRsv"
        @timeControl="timeControl"
        @rsvAvailableCheck="rsvAvailableCheck"
        @timePicker="timePicker"
      ></rsv-popup-form>
    </v-dialog>
    <v-dialog v-model="meetingroom_info" persistent max-width="600px">
      <meeting-room-info
        :rsvInput="rsvInput"
        :room_indx="room_indx"
        :currRoom="currRoom"
        @closeMrPopup="closeMrPopup"
      ></meeting-room-info>
    </v-dialog>
    <v-dialog v-model="unavailable_reservation" persistent max-width="250px">
      <modal :alert_detail="alert_detail" @closeModal="closeModal"></modal>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { clearAllData, getRoomData, RsvDataApi, removeRsvData } from "../api";
import RsvPopupForm from "./RsvPopupForm.vue";
import MeetingRoomInfo from "./MeetingRoomInfo.vue";
import Modal from "./Modal.vue";
// import ConstantValues from '../utils/constant-values.js'

export default {
  components: {
    RsvPopupForm,
    MeetingRoomInfo,
    Modal
  },
  data() {
    return {
      renderKey: 0,
      date: new Date().toISOString().substr(0, 10),
      dateConverted: new Date(),
      menu: false,
      modal: false,
      unavailable_reservation: false,
      alert_detail: { type: "", message: "" },
      timeTable: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      dialog: false,
      meetingroom_info: false,
      time_picker: false,
      currRoom: "",
      currCell: "",
      stCell: "",
      edCell: "",
      rooms: [],
      selected_time: {
        st: { HH: "", mm: "" },
        et: { HH: "", mm: "" }
      },
      active: 0,

      room_indx: 0,

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
        stTm: "",
        edTm: ""
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
        stTm: "",
        edTm: ""
      },

      // 회의실 색상 코드
      roomColorSet: [
        "#FE2EC8",
        "#FF4000",
        "#0101DF",
        "#FFBF00",
        "#B8982F",
        "#3CD0BA",
        "#1DEB4E",
        "#7269DF",
        "#9D69D1"
      ]
    };
  },

  methods: {
    clearAllData,
    method() {},

    ...mapActions([
      "addRsvData",
      "updateRsvData",
      "deleteRsvData",
      "loadRsvData",
      "loadRoomSrc"
    ]),
    ...mapMutations(["CLEAR_STOREDATA"]),

    getTimeStamp() {
      var d = new Date();
      var s =
        d.getFullYear() +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        ("0" + d.getDate()).slice(-2) +
        ("0" + d.getHours()).slice(-2) +
        ("0" + d.getMinutes()).slice(-2) +
        ("0" + d.getSeconds()).slice(-2);

      return s;
    },

    onRoomBtnClick(room) {
      this.meetingroom_info=true;
      this.currRoom=room;
      this.currRoom.img_src = require('../assets/' + room.room_id + '.gif');
      console.log('AAAAAAAA', this.currRoom);
    },

    cellClick(room, hour) {
      this.rsvInput.user_name = this.$store.state.user.user_name;
      this.rsvInput.user_id = this.$store.state.user.user_id;
      this.rsvInput.telNum = this.$store.state.user.tel_num;

      this.currCell = [room, hour];
      // console.log(room[1].rsv_key);

      if (hour.reserved === 2 || hour.reserved === 3) {
        this.rsvorg = this.rsvInput;
        this.dialog = true;
        return;
      }
      // 첫 셀에 대한 정보가 없을 경우 수행하는 조건문
      if (this.stCell === "") {
        this.stCell = [room, hour];
        this.stCell[1].selected = true;
      } else if (this.edCell === "") {
        this.edCell = [room, hour];
        if (
          // 첫 셀, 끝 셀 이름이 동일하고 시간이 동일할 경우 (1시간만 소약)
          this.stCell[0].name === this.edCell[0].name &&
          this.stCell[1].index === this.edCell[1].index
        ) {
          this.rsvInput.room_name = this.stCell[0].name;
          this.rsvInput.room_id = this.stCell[0].room_id;
          this.rsvInput.stHour = this.stCell[1].index;
          //종료 시간 인덱스에 30분을 더해서 저장해야 함
          this.rsvInput.edHour = this.stCell[1].index;

          this.dialog = true;
          this.stCell[1].selected = true;
          // this.stCell = "";
          // this.edCell = "";
        } else if (
          // 클릭 시 첫 셀이 소속된 방과 끝 셀의 방이 다른 경우 (두번째 클릭 시 초기화)
          this.rooms[this.room_indx].indexOf(this.stCell[0]) !=
          this.rooms[this.room_indx].indexOf(this.edCell[0])
        ) {
          // 끝 셀의 시간을 selected하고 첫 셀의 값으로 치환
          this.stCell[1].selected = false;
          this.edCell[1].selected = true;
          this.stCell = this.edCell;
          this.edCell = "";
        } else {
          // 정상적으로 첫 셀, 끝 셀이 선택된 경우
          // 예약 시작, 종료 시간 선언
          let stHour =
            this.edCell[1].index > this.stCell[1].index
              ? this.stCell[1].index
              : this.edCell[1].index;
          let edHour =
            this.edCell[1].index > this.stCell[1].index
              ? this.edCell[1].index
              : this.stCell[1].index;

          this.edCell[1].selected = true;
          console.log(stHour, edHour, room.hours);
          room.hours.forEach(e => {
            if (e.index > stHour && e.index < edHour) {
              e.selected = true;
            }
          });
          // 현재 예약 정보를 data에 저장
          this.rsvInput.room_name = this.stCell[0].name;
          this.rsvInput.room_id = this.stCell[0].room_id;
          this.rsvInput.stHour = stHour;
          this.rsvInput.edHour = edHour;
          this.dialog = true;
        }
      } else {
        // 첫 셀, 끝 셀이 모두 선택된 경우 실행하는 조건문
        // 이미 선택되어 있던 셀의 selected 초기화 후 stCell만 재할당
        let stHour =
          this.edCell[1].index > this.stCell[1].index
            ? this.stCell[1].index
            : this.edCell[1].index;
        let edHour =
          this.edCell[1].index > this.stCell[1].index
            ? this.edCell[1].index
            : this.stCell[1].index;
        // 선택된 셀 모두 초기화 (예약 팝업으로 진입하지 않은 경우)
        this.stCell[0].hours.forEach(e => {
          if (e.index >= stHour && e.index <= edHour) {
            e.selected = false;
          }
        });

        this.edCell = "";
        this.stCell = [room, hour];
        this.stCell[1].selected = true;
      }
    },
    makeReservation() {
      if (this.rsvAvailableCheck()) {
        this.rsvInput.date = this.date;
        this.rsvInput.rsv_id =
          this.rsvInput.date + this.rsvInput.room_id + this.rsvInput.stHour;
        this.rsvInput.rsv_created = this.getTimeStamp();
        console.log(this.rsvInput.edHour, this.rsvInput.stHour);
        console.log(this.timeControl(this.selected_time.st, "get"));

        let value = this.timeControl(this.selected_time.et, "get");
        this.rsvInput.stHour = this.timeControl(this.selected_time.st, "get");
        this.rsvInput.edHour = this.timeControl(value, "add");

        // this.rsvInput.stHour = this.makeHour(this.rsvInput.stHour);
        // this.rsvInput.edHour = this.makeHour(this.rsvInput.edHour);
        this.rsvInput.floor_id = this.room_indx;
        // if this.rsvInput.content = "";
        //   content= "hi"
        // 빔이 선택됐을때만 rsv_id정보 추가되고, 없으면 null
        // console.log(this.rsvInput);

        this.stCell = "";
        this.edCell = "";
        this.currCell = [];
        this.dialog = false;

        this.addRsvData(this.rsvInput);
        this.clearCellData();
        this.clearSelectionData();

        console.log("Reservation complete...");

        var vm = this;

        //  회의실 정보 post
        RsvDataApi({
          tel_num: this.$store.state.user.tel_num,
          token: this.$store.state.token,
          rsvdata: this.rsvInput,
          httpMethod: "INSERT"
        })
          .then(response => {
            console.log(response);
            if (response.data.statusCode == 409) {
              vm.unavailable_reservation = true;
              vm.alert_detail = {
                type: "rsvError",
                message: "기존 예약이 존재합니다."
              };
            } else {
              console.log(response);
            }
          })
          .catch(error => {
            console.log(error);
          });

        this.clearRsv(); //this.rsvInput = {};
      } else {
        return (
          (this.unavailable_reservation = true),
          (this.alert_detail = {
            type: "rsvError",
            message: "기존 예약이 존재합니다."
          })
        );
      }
    },

    cnclReservation() {
      this.stCell = "";
      this.edCell = "";
      this.currCell = [];

      this.deleteRsvData(this.rsvInput);
      this.dialog = false;

      this.clearSelectionData();

      RsvDataApi({
        tel_num: this.$store.state.user.tel_num,
        token: this.$store.state.token,
        rsvdata: this.rsvInput,
        httpMethod: "DELETE"
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },

    updateReservation() {
      if (this.rsvAvailableCheck()) {
        this.updateRsvData(this.rsvInput);
        console.log("updated...");

        var vm = this;

        RsvDataApi({
          tel_num: this.$store.state.user.tel_num,
          token: this.$store.state.token,
          rsvdata: this.rsvInput,
          rsvorg: this.rsvorg,
          httpMethod: "UPDATE"
        })
          .then(response => {
            console.log(response);
            if (response.data.statusCode == 409) {
              vm.unavailable_reservation = true;
              vm.alert_detail = {
                type: "rsvError",
                message: "기존 예약이 존재합니다."
              };
            } else {
              console.log(response);
            }
          })
          .catch(error => {
            console.log(error);
          });

        this.dialog = false;
        // this.currCell = "";
      } else {
        return (
          (this.unavailable_reservation = true),
          (this.alert_detail = {
            type: "rsvError",
            message: "기존 예약이 존재합니다."
          })
        );
      }
    },
    // 셀을 클릭했을 때 예약이 존재하는 경우(키 값이 존재하는 경우) 해당 키값에 해당되는 예약 데이터를 불러와 예약 데이터로로 저장
    updateRsv() {
      this.rsvInput = this.getRsvDataStore[this.currCell[1].rsv_key];
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
        stTm: "",
        edTm: ""
      };
    },
    //셀을 초기화 (예약 정보 초기화)
    clearCellData() {
      for (var i = 0; i < this.rooms[this.room_indx].length; i++) {
        this.rooms[this.room_indx][i].hours.forEach(e => {
          e.reserved = 0;
          e.border_right = "false";
          e.border_left = "false";
          e.rsv_key = "";
        });
      }
    },
    //셀의 셀렉트 데이터 초기화
    clearSelectionData() {
      for (var i = 0; i < this.rooms[this.room_indx].length; i++) {
        this.rooms[this.room_indx][i].hours.forEach(e => {
          e.selected = 0;
          // this.currCell = "";
        });
      }
    },
    // 예약 가능한 상태인지 조회 (가능: true / 불가능: false 리턴)
    rsvAvailableCheck() {
      var room_check = [];
      for (var i = 0; i < this.rooms[this.room_indx].length; i++) {
        if (this.rooms[this.room_indx][i].room_id === this.rsvInput.room_id) {
          room_check = this.rooms[this.room_indx][i];
        }
      }

      for (var x = 0; x < 24; x++) {
        if (
          this.rsvInput.stHour <= room_check.hours[x].index &&
          room_check.hours[x].index <=
            this.timeControl(this.rsvInput.edHour, "sub") &&
          room_check.hours[x].reserved === 2
        ) {
          console.log(
            "x:",
            x,
            "stHour:",
            this.rsvInput.stHour,
            "edHour",
            this.rsvInput.edHour,
            "room:",
            room_check.hours
          );
          return false;
        }
      }
      return true;
    },

    swipeHandler(direction) {
      console.log(direction);
      if (direction == "left") {
        // this.room_indx += 1;
        // if (this.room_indx >= this.room_src.length) {
        //   this.room_indx = 0;
        // }
      } else if (direction == "right") {
        // this.room_indx -= 1;
        // if (this.room_indx < 0) {
        //   this.room_indx = this.room_src.length -1;
        // }
      }
    },
    tabChanged() {
      this.room_indx = this.active;
    },
    // 캘린더의 날짜 하루씩 증감
    dateDecrement() {
      let today = this.dateConverted;
      today.setDate(today.getDate() - 1);
      this.date = today.toISOString().substr(0, 10);
    },
    dateIncrement() {
      let today = this.dateConverted;
      today.setDate(today.getDate() + 1);
      this.date = today.toISOString().substr(0, 10);
    },
    //예약 안내 팝업에서 시작/종료 시각을 증감하는 메소드
    timeControl(val, con) {
      console.log("val:", val);
      if (typeof val === "object") {
        var hour = val.HH;
        var minute = val.mm;
      } else if (typeof val === "string") {
        var hour = val.substring(0, 2);
        var minute = val.substring(2, 4);
      }
      console.log("in timeControl:", hour, "/", minute);
      if (con === "add" && minute === "00") {
        minute = "30";
      } else if (con === "add" && minute === "30") {
        this.pad((hour = parseInt(hour) + 1), 2);
        minute = "00";
      }
      if (con === "sub" && minute === "00") {
        this.pad((hour = parseInt(hour) - 1), 2);
        minute = "30";
      } else if (con === "sub" && minute === "30") {
        minute = "30";
      }
      if (con === "set") {
        return { HH: hour, mm: minute };
      } else if (con === "get") {
        return val.HH + val.mm;
      }
      return hour + minute;
    },
    // timeFetch(con) {
    //   if (con === "get")
    //   this.selected_time.st = this.timeControl(this.rsvInput.stHour, "sum");
    //   this.selected_time.et = this.timeControl(this.rsvInput.etHour, "sum");
    // },

    pad(n, width) {
      n = n + "";
      return n.length >= width
        ? n
        : new Array(width - n.length + 1).join("0") + n;
    },

    // 예약된 시간대 색상을 커스텀 설정하는 메소드로 css에 해당 값을 전달 함
    // 회의실 마다 고유 색상 지정 & 홀수 시간대 예약 셀 바탕 색 지정
    roomColors(index, left, right, hour) {
      let color;
      if (Math.floor(hour) % 2 === 0) {
        color = "#fff";
      } else {
        color = "#F2F2F2";
      }

      return {
        "--room-color-set": this.roomColorSet[index],
        "--room-border-left": left,
        "--room-border-right": right,
        "--empty-cell-color": color
      };
    },

    roomBtn(room_name) {
      let size;
      if (room_name <= 7) {
        size = "13px";
      } else {
        size = "9px";
      }

      return {
        "--room-btn-text-size": size,
        "--room-btn-width-size": "300px;"
      };
    },

    createRoom() {
      for (var i = 0; i < this.$store.state.room_src.length; i++) {
        this.rooms.push(
          this.$store.state.room_src[i][1].map(e => ({
            name: e[0],
            room_id: e[1],
            hours: Array(24)
              .fill(0)
              .map((e, i) => ({
                index: this.pad(
                  Math.floor(i * 0.5 + 8) * 100 + ((i * 0.5 + 8) % 1) * 60,
                  4
                ),
                selected: false,
                reserved: 0,
                st_index: 0,
                ed_index: 0,
                user_name: "",
                border_right: false,
                border_left: false,
                rsv_key: ""
              }))
          }))
        );
      }
    },
    // 페이지 refresh 할 때 스토어의 데이터를 바로 불러오기 위한 코드
    loadRsvStore() {
      console.log(">>loadRsvData...");
      this.loadRsvData(this.date, this.room_indx);
    },
    closeDialog() {
      this.dialog = false;
    },
    closeMrPopup() {
      this.meetingroom_info = false;
    },
    closeModal() {
      this.unavailable_reservation = false;
      this.alert_detail.message = "";
    },
    timePicker(status) {
      if (status === "on") {
        this.time_picker = true;
      } else {
        this.time_picker = false;
      }
    },

    forceRerender() {
      this.renderKey += 1;
    },
    // makeHour(hr) {
    //   var h = ("0" + Math.trunc(hr)).slice(-2);

    //   return h + (hr - Math.trunc(hr) === 0.5 ? "30" : "00");
    // },

    async fetchRsvData() {
      console.log(">>fetchRsvData...");
      this.clearCellData();

      let rsv_datas = { data: { rsv: [] } };

      this.drawRooms(
        await RsvDataApi({
          tel_num: this.$store.state.user.tel_num,
          token: this.$store.state.token,
          rsvdata: {
            date: this.date,
            floor_id: this.room_indx
          },
          httpMethod: "SELECT"
        })
        // .then(response => {
        //   console.log(response);
        //   return response.data.rsv;
        // })
        // .catch(error => {
        //   console.log(error);
        // })
      );
      // this.loadRsvData();

      console.log("실행...");
    },
    drawRooms(rsv_datas) {
      console.log(rsv_datas);
      // console.log(this.rsv_datas.data.rsv.length);
      for (var rsv_data of rsv_datas.data.rsv) {
        console.log("rsv_data:", rsv_data);
        var room_name = rsv_data[7];
        var stHour = rsv_data[3];
        var edHour = this.timeControl(rsv_data[4], "sub");
        var rsv_date = rsv_data[5];
        var rsv_key = rsv_data[6];
        console.log("예약건:", rsv_data);

        //if (rsv_date === this.date) {
        for (var i = 0; i < this.rooms[this.room_indx].length; i++) {
          this.rooms[this.room_indx][i].hours.forEach(e => {
            if (
              e.index >= stHour &&
              e.index <= edHour &&
              this.rooms[this.room_indx][i].name === room_name
            ) {
              if (e.index === stHour) {
                e.border_left = "1px solid";
              }
              if (e.index === edHour) {
                e.border_right = "1px solid";
              }
              e.reserved = 2;
              e.rsv_key = rsv_key;
            }
          });
        }
        //}
      }
    }
  },
  async created() {
    console.log("created");
    this.loadRsvStore(
      await this.createRoom(
        await this.loadRoomSrc(
          await getRoomData({
            tel_num: this.$store.state.user.tel_num,
            token: this.$store.state.token
          })
        ),
        (this.renderKey = 1)
      )
    );
    console.log("created hook complete");
  },

  computed: {
    ...mapGetters(["getRsvDataStore"])
  },

  mounted() {
    console.log("mounted");
    // test 예약건 하드 코딩
    let data = {
      id: "08ad375f-995a-150f-172c-58bf29b08f9e",
      date: this.date,
      user_id: "",
      user_name: "홍길동",
      telNum: "010-3333-3333",
      title: "주간 회의",
      content: "개발 진행 상황 공유",
      stHour: "0930",
      edHour: "1130",
      room_name: "몽블랑",
      room_id: "MTR000"
    };
    let data_second = {
      id: "b216870d-b39a-bc2a-bf47-9349a031a530",
      date: this.date,
      user_id: "",
      user_name: "김갑환",
      telNum: "010-9999-9999",
      room_name: "한라산",
      title: "코드 리뷰",
      content: "Vue.js 코드리뷰 예정입니다.",
      stHour: "1000",
      edHour: "1130"
    };

    this.addRsvData(data);
    this.addRsvData(data_second);
  },
  // 페이지 refresh 할 때 스토어의 데이터를 바로 불러오기 위한 코드
  // beforeCreate() {
  //   console.log("beforeCreate");
  //   // this.$store.getters.getRsvData;
  //   this.$store.dispatch("loadRsvData", this.date, this.room_indx);
  //   console.log(">>loadRsvData...");
  // },
  // 페이지 refresh 할 때 예약 데이터 화면 노출 위한 코드s
  beforeUpdate() {
    console.log("beforeUpadate");
    // if (this.renderKey > 0) {
    //   this.fetchRsvData();
    if (this.rsvInput.edHour != "") {
      this.selected_time.st = this.timeControl(this.rsvInput.stHour, "set");
      let value = this.timeControl(this.rsvInput.edHour, "add");
      this.selected_time.et = this.timeControl(value, "set");
    }
    console.log(">>fetchRsvData...");
    // }
  }
};
/*
    seleted
      0: 예약 안됨
      1: 반만 예약됨
      2: 내가 예약
      3: 내가 반만 예약
      4: 남이 예약
  */
</script>


<style lang="stylus" scoped>
.custom {
  width: 8px !important;
}

.v-input {
  font-size: 1em;
}

.v-text-field {
  padding-top: 0px;
  margin-top: 0px;
}

.btn-emptyCell {
  padding: 0px;
  height: 30px;
  border-left: 1px dotted #f00;
  border-right: 0px dotted #f00;
  color: #fff;
  border-radius: 0px;
  background-color: var(--empty-cell-color);
  border-color: #D8D8D8;
}

.btn-emptyCell:focus {
  padding: 0px;
  height: 30px;
  color: #BDBDBD;
  border-radius: 0px;
  background-color: #E6E6E6;
  border-color: #E6E6E6;
}

.btn-emptyCell:hover {
  padding: 0px;
  height: 30px;
  color: #BDBDBD;
  border-radius: 0px;
  background-color: #e6e6e6;
  border-color: #e6e6e6;
}

.btn-emptyCell:active {
  padding: 0px;
  height: 30px;
  color: #BDBDBD;
  border-radius: 0px;
  background-color: #E0F2F7;
  border-color: #e6e6e6;
}

.btn-clickedCell {
  padding: 0px;
  height: 30px;
  color: #BDBDBD;
  border-radius: 0px;
  background-color: #F5F6CE;
  border-color: #D7DF01;
}

.btn-clickedCell:focus {
  padding: 0px;
  height: 30px;
  color: #BDBDBD;
  border-radius: 0px;
  background-color: #F5F6CE;
  border-color: #F5F6CE;
}

.btn-clickedCell:hover {
  padding: 0px;
  height: 30px;
  color: #BDBDBD;
  border-radius: 0px;
  background-color: #F3F781;
  border-color: #F3F781;
}

.btn-clickedCell:active {
  padding: 0px;
  height: 30px;
  color: #BDBDBD;
  border-radius: 0px;
  background-color: #F3F781;
  border-color: #F3F781;
}

.btn-bookedCell {
  padding: 0px;
  height: 30px;
  color: #fff;
  border-radius: 0px;
  text-align: right;
  overflow: visible;
  border-left: var(--room-border-left);
  border-right: var(--room-border-right);
  background: linear-gradient(180deg, white, var(--room-color-set));
  border-color: var(--room-color-set);
}

.btn-bookedCell:focus {
  padding: 0px;
  height: 30px;
  color: #fff;
  border-radius: 0px;
  background-color: #64A8F2;
  border-color: #64A8F2;
}

.btn-bookedCell:hover {
  padding: 0px;
  height: 30px;
  color: #fff;
  border-radius: 0px;
  background-color: #4071A4;
  border-color: #4071A4;
}

.btn-bookedCell:active {
  padding: 0px;
  height: 30px;
  color: #fff;
  border-radius: 0px;
  background-color: #4071A4;
  border-color: #4071A4;
}

.btn-bookedOthers {
  padding: 0px;
  height: 30px;
  color: #fff;
  border-radius: 0px;
  border-left: var(--room-border-left);
  border-right: var(--room-border-right);
  background: linear-gradient(180deg, white, #665B5B);
  border-color: #665B5B;
}

.btn-bookedOthers:focus {
  padding: 0px;
  height: 30px;
  color: #fff;
  border-radius: 0px;
  background-color: #64A8F2;
  border-color: #64A8F2;
}

.btn-bookedOthers:hover {
  padding: 0px;
  height: 30px;
  color: #fff;
  border-radius: 0px;
  background-color: #4071A4;
  border-color: #4071A4;
}

.btn-bookedOthers:active {
  padding: 0px;
  height: 30px;
  color: #fff;
  border-radius: 0px;
  background-color: #4071A4;
  border-color: #4071A4;
}

.v-btn {
  font-size: var(--room-btn-text-size);
  max-width: var(--room-btn-width-size);
}
</style>