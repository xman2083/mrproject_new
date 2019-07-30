<template>
  <div>
    <v-tabs v-on:change="tabChanged" v-model="active" color="cyan" dark slider-color="yellow">
      <v-tab v-for="room in room_src" :key="room[2]" ripple>{{ room[0] }}</v-tab>
      <v-tab-item v-for="room in room_src" :key="room[2]"></v-tab-item>
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
              <v-text-field v-model="date" label="날짜선택" prepend-icon="event" readonly v-on="on"></v-text-field>
            </v-flex>

            <v-flex xs8 sm8 md10 lg10>
              <v-btn small outline color="#BDBDBD" v-on:click="dateDecrement">◀ 이전일</v-btn>
              <v-btn small outline color="#BDBDBD" v-on:click="dateIncrement">다음일 ▶</v-btn>
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
                    <v-btn outline style="font-size:8px;" :color="roomColorSet[index]">{{room.name}}</v-btn>
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
                          :class="{ 'btn-secondary': (hour.reserved ===4 ),
                                    'btn-bookedCell': (hour.reserved === 2 || hour.reserved === 3),
                                    'btn-info': (hour.reserved === 1),
                                    'btn-emptyCell': (hour.reserved === 0),
                                    'btn-clickedCell': (hour.selected) }"
                          v-on:click="cellClick(room, hour)"
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
    <v-btn color="indigo" dark v-on:click="clearAllData">예약DB삭제</v-btn>
    <v-btn color="grey" dark v-on:click="CLEAR_STOREDATA">스토어 삭제</v-btn>
    <v-btn color="warning" dark v-on:click="fetchRsvData">fetch</v-btn>
    <div>{{this.$store.state.rsvdata}}</div>

    <!-- 회의실 예약 팝업, dialog가 true 일 경우만 노출 -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <v-avatar color="indigo" size="36">
            <span class="white--text" style="font-size:smaller;">{{this.room_src[room_indx][0]}}</span>
          </v-avatar>
          <span class="headline" style="color:grey !important;">&nbsp;&nbsp;회의실 예약하기&nbsp;&nbsp;</span>
          <span class="grey--text subtitle-1">{{this.date}}</span>
          <!-- <span>&nbsp;st: {{this.rsvData.stHour}} / ed: {{this.rsvData.edHour}}</span> -->
          <span>&nbsp;stHour: {{this.rsvData.stHour}} / edHour: {{this.rsvData.edHour}}</span>
        </v-card-title>
        <v-divider style="margin:0px;"></v-divider>
        <v-card-text style="padding:0;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs3>
                <v-text-field dark solo value="회의실" style="font-size:smaller;"></v-text-field>
              </v-flex>
              <v-flex xs9>
                <v-text-field v-model="rsvData.room_name" readonly solo></v-text-field>
              </v-flex>
              <v-flex xs3>
                <v-text-field style="font-size:smaller;" value="시작" readonly solo dark></v-text-field>
              </v-flex>
              <v-flex xs3>
                <v-text-field suffix="시" :value="parseInt(rsvData.stHour)" solo readonly></v-text-field>
              </v-flex>
              <v-flex xs3>
                <v-text-field suffix="분" :value="rsvData.stHour%1*60" solo readonly></v-text-field>
              </v-flex>
              <v-flex xs3>
                <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
                  <v-icon
                    dark
                    v-on:click="rsvData.stHour-=0.5"
                    :disabled="rsvData.stHour<=8?true:false"
                  >remove</v-icon>
                </v-btn>
                <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
                  <v-icon
                    dark
                    v-on:click="rsvData.stHour+=0.5"
                    :disabled="rsvData.stHour>19 || rsvData.stHour >= rsvData.edHour?true:false"
                  >add</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs3>
                <v-text-field value="종료" style="font-size:smaller;" readonly solo dark></v-text-field>
              </v-flex>
              <v-flex xs3>
                <v-text-field suffix="시" :value="parseInt(rsvData.edHour+0.5)" solo></v-text-field>
              </v-flex>
              <v-flex xs3>
                <v-text-field suffix="분" :value="(rsvData.edHour+0.5)%1*60" solo></v-text-field>
              </v-flex>
              <v-flex xs3>
                <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
                  <v-icon
                    dark
                    v-on:click="rsvData.edHour-=0.5"
                    :disabled="rsvData.edHour<=8 || rsvData.edHour <= rsvData.stHour?true:false"
                  >remove</v-icon>
                </v-btn>
                <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
                  <v-icon
                    dark
                    v-on:click="rsvData.edHour+=0.5"
                    :disabled="rsvData.edHour>19?true:false"
                  >add</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <v-text-field label="예약자 성명*" v-model="rsvData.user_name" required clearable></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <v-text-field label="휴대폰 번호" v-model="rsvData.telNum"></v-text-field>
              </v-flex>
              <!-- <v-flex xs2 sm2 md2>
                <a :href="`tel:+${ rsvData.telNum }`">
                  <v-icon color="red" x-large>phone</v-icon>
                </a>
              </v-flex>-->

              <v-flex xs12 sm12 md12>
                <v-text-field
                  v-if="dialog"
                  autofocus
                  required
                  label="회의 주제*"
                  v-model="rsvData.title"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="회의 내용" v-model="rsvData.content" clearable></v-text-field>
              </v-flex>
              <small>*필수 입력 사항 입니다.</small>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="disabled" @click="dialog = false">닫기</v-btn>
          <v-btn
            color="warning"
            v-if="currCell !== '' && (currCell[1].reserved === 2 || currCell[1].reserved === 3)"
            v-on:click="cnclReservation"
          >예약취소</v-btn>
          <v-btn color="primary" v-on:click="makeReservation">예약</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { clearAllData } from "../api";
// import ConstantValues from '../utils/constant-values.js'
export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      dateConverted: new Date(),
      menu: false,
      modal: false,
      timeTable: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      dialog: false,
      room_src: [
        [
          "16층",
          [
            "몽블랑",
            "킬리만자로",
            "남산",
            "티티카카",
            "아차산",
            "한라산",
            "A",
            "B"
          ],
          0
        ],
        [
          "17층",
          ["1회의실", "2회의실", "3회의실", "4회의실", "5회의실", "6회의실"],
          1
        ],
        ["2층", ["접견실"], 2],
        ["보라매", ["하와이", "발리", "몰디브", "8층 회의실", "개발실"], 3],
        [
          "빔-남산",
          [
            "빔1",
            "빔2",
            "빔3",
            "무선 MIC1",
            "무선 MIC2",
            "무선 Pin MIC",
            "Class Cam"
          ],
          4
        ],
        ["빔-보라매", ["빔1", "빔2"], 5]
      ],
      room_indx: 0,

      currCell: "",
      stCell: "",
      edCell: "",
      rooms: [],
      newroom: [],
      // curr_rooms.map(e => ({
      //   name: e,
      //   hours: Array(12).fill(0).map((e, i) => ({
      //     index: i + 8,
      //     //disp: (i + 8) / ,
      //     selected: false
      //   }))
      // })),

      active: null,

      rsvData: {
        user_name: "",
        date: "",
        telNum: "",
        room_name: "",
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

  mounted() {
    this.loadRsvData();
  },

  methods: {
    clearAllData,

    ...mapActions([
      "addRsvData",
      "updateRsvData",
      "removeRsvData",
      "loadRsvData"
    ]),
    ...mapMutations(["CLEAR_STOREDATA"]),

    cellClick(room, hour) {
      this.rsvData.user_name = this.$store.state.user.user_name;
      this.rsvData.telNum = this.$store.state.user.tel_num;
      //if hour.reserved
      // console.log(
      //   this.room_indx,
      //   room.name,
      //   this.roomsrooms[this.room_indx].indexOf(room),
      //   hour.index,
      //   hour.selected
      // );
      console.log(window.innerWidth);

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
          this.rsvData.room_name = this.stCell[0].name;
          this.rsvData.stHour = this.stCell[1].index;
          this.rsvData.edHour = this.stCell[1].index;

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
          this.rsvData.room_name = this.stCell[0].name;
          this.rsvData.stHour = stHour;
          this.rsvData.edHour = edHour;
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
      // 예약 API 호출
      let stHour =
        this.rsvData.edHour > this.rsvData.stHour
          ? this.rsvData.stHour
          : this.rsvData.edHour;
      // console.log(stHour);
      let edHour =
        this.rsvData.edHour > this.rsvData.stHour
          ? this.rsvData.edHour
          : this.rsvData.stHour;
      this.stCell[1].border_left = "1px solid";
      this.edCell[1].border_right = "1px solid";
      this.stCell[0].hours.forEach(e => {
        if (e.index >= stHour && e.index <= edHour) {
          e.reserved = 2;
          e.selected = false;
          e.st_index = stHour;
          e.ed_index = edHour;
        }
        this.rsvData.date = this.date 
      });

       //rsvData Post <<-ing
      this.$http.post("https://bjey314qaa.execute-api.ap-northeast-2.amazonaws.com/inner_seat/getrsvdata", {
        headers: 'hi',
        title: this.rsvData.date,
        body: this.rsvData.user_name,
        userID : 1
      }).then(function(data){
        console.log(data);
      });
     

      
      this.stCell = "";
      this.edCell = "";
      this.dialog = false;

      this.addRsvData(this.rsvData);
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
    fetchRsvData() {
      this.loadRsvData();
      console.log("Fetched");
      // console.log(this.getRsvData)
      for (var key in this.getRsvData) {
        console.log(key);
        let room_name = this.getRsvData[key].room_name;
        let user_name = this.getRsvData[key].user_name;
        let stHour = this.getRsvData[key].stHour;
        let edHour = this.getRsvData[key].edHour;

        for (var i = 0; i < this.rooms[this.room_indx].length; i++) {
          this.rooms[this.room_indx][i].hours.forEach(e => {
            if (
              e.index >= stHour &&
              e.index <= edHour &&
              this.rooms[this.room_indx][i].name === room_name
            ) {
              e.reserved = 2;
              e.name = user_name;
            }
          });
        }
      }
    }
  },
  created() {
    // 회의실 시간 테이블 정보 생성
    for (var i = 0; i < this.room_src.length; i++) {
      this.rooms.push(
        this.room_src[i][1].map(e => ({
          name: e,
          hours: Array(24)
            .fill(0)
            .map((e, i) => ({
              index: i * 0.5 + 8,
              selected: false,
              reserved: 0,
              st_index: 0,
              ed_index: 0,
              name: "",
              border_right: false,
              border_left: false
            }))
        }))
      );
    }
  },
  computed: {
    ...mapGetters(["getRsvData"])
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
</style>