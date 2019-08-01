<template>
  <div :key="renderKey">
    <v-tabs @change="tabChanged" v-model="active" color="cyan" dark slider-color="yellow">
      <v-tab v-for="room in this.$store.state.room_src" :key="room[2]" ripple>{{ room[0] }}</v-tab>
      <v-tab-item v-for="room in this.$store.state.room_src" :key="room[2]"></v-tab-item>
    </v-tabs>

    <v-flex xs12 sm12 md12>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-layout align-center>
            <v-flex xs4 sm4 md2 lg2>
              <v-text-field v-model="date" prepend-icon="event" readonly v-on="on"></v-text-field>
            </v-flex>

            <v-flex xs8 sm8 md10 lg10>
              <v-btn small outline color="#BDBDBD" @click="dateDecrement">◀ 이전일</v-btn>
              <v-btn small outline color="#BDBDBD" @click="dateIncrement">다음일 ▶</v-btn>
            </v-flex>
          </v-layout>
        </template>
        <v-date-picker v-model="date" @input="menu = false" locale="ko-kr"></v-date-picker>
      </v-menu>
    </v-flex>

    <div>
      <div class="panel">
        <div class="panel-body">
          <div class="row">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>
                    <button
                      type="button"
                      class="btn btn-primary btn-block"
                      style="width:80px;background-color:grey;border-style:solid;border-color:#fff;box-shadow: 0px 0px 0px #fff;  padding:0px !important; border-round: 0px !important;"
                      disabled
                    >회의실</button>
                  </th>

                  <th>
                    <div class="btn-group btn-group-justified flex-wrap">
                      <div class="btn-group mr-2" role="group" v-for="time in timeTable">
                        <button
                          type="button"
                          class="btn btn-primary"
                          style="background-color:grey;border-style:solid;border-width:2px;border-color:#fff;box-shadow: 0px 0px 0px #fff; padding:0px !important; border-round: 0px !important"
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
                  <td style="padding:2px;">
                    <!-- <button type="button" class="btn btn-success btn-block">{{room.name}}</button> -->
                    <v-btn
                      @click="meetingroom_info=true, currRoom=room"
                      outline
                      style="font-size:8px;"
                      :color="roomColorSet[index]"
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
                          @click="cellClick(room, hour)"
                        >
                          <span style="font-size: smaller; text-align: center;">&nbsp;</span>
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
    <v-btn color="indigo" dark @click="clearAllData">예약DB삭제</v-btn>
    <v-btn color="grey" dark @click="CLEAR_STOREDATA">스토어 삭제</v-btn>
    <v-btn color="warning" dark @click="fetchRsvData">fetch</v-btn>
    <v-btn color="info" dark @click="forceRerender">rerender:{{this.renderKey}}</v-btn>
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
        @dialogChange="dialogChange"
        @makeReservation="makeReservation"
        @cnclReservation="cnclReservation"
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
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { clearAllData, getRoomData, getRsvData } from "../api";
import RsvPopupForm from "./RsvPopupForm.vue";
import MeetingRoomInfo from "./MeetingRoomInfo.vue";
// import ConstantValues from '../utils/constant-values.js'



export default {
  components: {
    RsvPopupForm,
    MeetingRoomInfo
  },
  data() {
    return {
      renderKey: 0,
      date: new Date().toISOString().substr(0, 10),
      dateConverted: new Date(),
      menu: false,
      modal: false,
      timeTable: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      dialog: false,
      meetingroom_info: false,
      currRoom: "",
      currCell: "",
      stCell: "",
      edCell: "",
      rooms: [],
      // curr_rooms.map(e => ({
      //   name: e,
      //   hours: Array(12).fill(0).map((e, i) => ({
      //     index: i + 8,
      //     //disp: (i + 8) / ,
      //     selected: false
      //   }))
      // })),

      active: null,

      room_indx: 0,

      rsvInput: {
        date: "",
        user_id: "",
        user_name: "",
        telNum: "",
        room_id: "",
        title: "",
        content: "",
        stHour: 0,
        edHour: 0
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

    ...mapActions([
      "addRsvData",
      "updateRsvData",
      "removeRsvData",
      "loadRsvData",
      "loadRoomSrc"
    ]),
    ...mapMutations(["CLEAR_STOREDATA"]),

    cellClick(room, hour) {
      this.rsvInput.user_name = this.$store.state.user.user_name;
      this.rsvInput.telNum = this.$store.state.user.tel_num;
      //if hour.reserved
      // console.log(
      //   this.room_indx,
      //   room.name,
      //   this.roomsrooms[this.room_indx].indexOf(room),
      //   hour.index,
      //   hour.selected
      // );
      // console.log(window.innerWidth);

      this.currCell = [room, hour];

      if (hour.reserved === 2 || hour.reserved === 3) {
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
          // 첫 셀, 끝 셀 이름이 동일하고 시간이 동일할 경우 (1시간만 예약)
          this.stCell[0].name === this.edCell[0].name &&
          this.stCell[1].index === this.edCell[1].index
        ) {
          this.rsvInput.room_name = this.stCell[0].name;
          this.rsvInput.stHour = this.stCell[1].index;
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
          this.rsvInput.stHour = stHour;
          this.rsvInput.edHour = edHour;
          this.dialog = true;
        }
      } else {
        // 첫 셀, 끝 셀이 모두 선택된 경우 실행하는 조건문
        // 시작 시간, 종료 시간 선언
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
      //  //rsvData Post <<-ing
      // this.$http.post("https://jsonplaceholder.typicode.com/posts", {
      //   title: this.rsvData.date,
      //   body: this.rsvData.user_name,
      //   userID : 1
      // }).then(function(data){
      //   console.log(data);
      // });

      this.rsvInput.date = this.date;
      //  회의실 정보 post
      getRsvData({})
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });

      this.stCell = "";
      this.edCell = "";
      this.dialog = false;

      this.addRsvData(this.rsvInput);
      this.clearSelection();
      this.fetchRsvData();
      console.log("Reservation complete...");
      // this.fetchRsvData();
    },

    cnclReservation() {
      //예약 취소 API 호출
      let stHour = this.currCell[1].st_index;
      let edHour = this.currCell[1].ed_index;

      this.currCell[0].hours.forEach(e => {
        if (e.index >= stHour && e.index <= edHour) {
          e.reserved = 0;
          e.selected = false;
          e.st_index = 0;
          e.ed_index = 0;
        }
      });
      this.currCell = "";
      this.dialog = false;
    },
    closeReservation() {},
    clearSelection() {
      for (var i = 0; i < this.rooms[this.room_indx].length; i++) {
        this.rooms[this.room_indx][i].hours.forEach(e => {
          e.selected = false;
        });
      }
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
    startHourSel(room, hour) {
      console.log("st:" + hour.index);
    },
    endHourSel(room, hour) {
      console.log("ed:" + hour.index);
    },
    // 날짜 하루씩 증감하는 함수
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
    dialogChange() {
      this.dialog = false;
    },
    closeMrPopup() {
      this.meetingroom_info = false;
    },
    forceRerender() {
      this.renderKey += 1;
    },
    fetchRsvData() {
      // this.loadRsvData();
      console.log("Fetching...");
      // console.log(this.geRsvData)
      for (var key in this.getRsvDataStore) {
        // console.log(key);
        let room_name = this.getRsvDataStore[key].room_name;
        let user_name = this.getRsvDataStore[key].user_name;
        let stHour = this.getRsvDataStore[key].stHour;
        let edHour = this.getRsvDataStore[key].edHour;

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
              e.name = user_name;
              e.rsv_key = key;
            }
          });
        }
      }
    }
  },
  created() {
    console.log("created");
    // 회의실 시간 테이블 정보 생성
    for (var i = 0; i < this.$store.state.room_src.length; i++) {
      this.rooms.push(
        this.$store.state.room_src[i][1].map(e => ({
          name: e,
          hours: Array(24)
            .fill(0)
            .map((e, i) => ({
              index: i * 0.5 + 8,
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
    };

     getRoomData({tel_num: this.$store.state.user.tel_num, token:this.$store.state.token})
        .then(response => {
          console.log(response);
          if(response.data.success) {
            console.log("success");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

 
  computed: {
    ...mapGetters(["getRsvDataStore"])
  },

  mounted() {
    console.log("mounted");
    // this.loadRsvData();
    // this.fetchRsvData();
    // this.forceRerender();
    // alert(this.$store.state.rsvdata)
    // this.loadRoomSrc();
  },
  // 페이지 refresh 할 때 스토어의 데이터를 바로 불러오기 위한 코드
  beforeCreate() {
    console.log("beforeCreate");
    // this.$store.getters.getRsvData;
    this.$store.dispatch("loadRsvData");
    console.log("loadRsvData...");
  },
  // 페이지 refresh 할 때 예약 데이터 화면 노출 위한 코드s
  beforeUpdate() {
    console.log("beforeUpadate");
    this.fetchRsvData();
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
</style>