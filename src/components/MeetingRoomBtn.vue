<template>
  <div>
    <v-tabs v-on:change="tabChanged" v-model="active" color="cyan" dark slider-color="yellow">
      <v-tab v-for="room in room_src" :key="room[2]" ripple>{{ room[0] }}</v-tab>
      <v-tab-item v-for="room in room_src" :key="room[2]"></v-tab-item>
    </v-tabs>

    <v-flex xs12 sm6 md4>
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
          <v-text-field v-model="date" label="날짜선택" prepend-icon="event" readonly v-on="on"></v-text-field>
          <div>
            <v-btn small depressed color="grey" v-on:click="dateDecrement">이전일</v-btn>
            <v-btn small depressed color="grey" v-on:click="dateIncrement">다음일</v-btn>
          </div>
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
                    <button type="button" class="btn btn-info btn-block">회의실</button>
                  </th>

                  <th>
                    <button type="button" class="btn btn-info btn-block">시간</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="room in rooms[room_indx]">
                  <td>
                    <button type="button" class="btn btn-warning btn-block">{{room.name}}</button>
                  </td>
                  <td>
                    <div class="btn-group btn-group-justified flex-wrap">
                      <div class="btn-group" v-for="hour in room.hours">
                        <!-- reserved
                        0: 빈칸 / 1: ??? / 2,3: 예약완료 / 4: 예약 불가-->
                        <button
                          type="button"
                          class="btn btn-block pl-1 pr-1"
                          :class="{ 'btn-secondary': (hour.reserved ===4 ),
                                    'btn-bookedCell': (hour.reserved === 2 || hour.reserved === 3),
                                    'btn-info': (hour.reserved === 1),
                                    'btn-emptyCell': (hour.reserved === 0),
                                    'btn-clickedCell': (hour.selected) }"
                          v-on:click="cellClick(room, hour)"
                        >
                          <span style="font-size: smaller; text-align: center;">{{hour.index}}</span>
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
    <!-- <v-flex>
                <div>예약자명: {{this.$store.state.user.user_name}}</div>
                <div>예약자번호: {{this.$store.state.user.tel_num}} </div>
    </v-flex>-->

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{this.date}} 회의실 예약하기</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs4>
                <v-text-field label="회의실명" v-model="this.reservationInfo.name" readonly disabled></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field label="시작시간" v-model="this.reservationInfo.stHour" readonly disabled></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field label="종료시간" v-model="this.reservationInfo.edHour" readonly disabled></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <v-text-field label="예약자 성명*" v-model="this.rsvData.name" required></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <v-text-field label="휴대폰 번호" v-model="this.rsvData.telNum"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="회의 주제*" v-model="this.rsvData.title" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="회의 내용" v-model="this.rsvData.content"></v-text-field>
              </v-flex>
              <small>*필수 입력 사항 입니다.</small>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">닫기</v-btn>
          <v-btn
            color="blue darken-1"
            flat
            v-if="currCell !== '' && (currCell[1].reserved === 2 || currCell[1].reserved === 3)"
            v-on:click="cnclReservation"
          >예약취소</v-btn>
          <v-btn color="blue darken-1" flat v-on:click="makeReservation">예약</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import ConstantValues from '../utils/constant-values.js'
export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      dateConverted: new Date(),
      menu: false,
      modal: false,

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
      // curr_rooms.map(e => ({
      //   name: e,
      //   hours: Array(12).fill(0).map((e, i) => ({
      //     index: i + 8,
      //     //disp: (i + 8) / ,
      //     selected: false
      //   }))
      // })),

      active: null,
      reservationInfo: {
        name: "",
        stHour: "",
        edHour: ""
      },
      rsvData: {
        name: "",
        title: "",
        content: "",
        telNum: ""
      }
    };
  },
  methods: {
    cellClick(room, hour) {
      // this.rsvData.telNum = getUserFromCookie();
      //if hour.reserved
      console.log(
        this.room_indx,
        room.name,
        this.rooms[this.room_indx].indexOf(room),
        hour.index,
        hour.selected
      );
      console.log(window.innerWidth);

      this.currCell = [room, hour];

      if (hour.reserved === 2 || hour.reserved === 3) {
        this.dialog = true;
        return;
      }

      if (this.stCell === "") {
        this.stCell = [room, hour];
        this.stCell[1].selected = true;
      } else if (this.edCell === "") {
        this.edCell = [room, hour];
        if (
          // 첫 셀, 끝 셀 이름이 동일하고 시간이 동일할 경우 (1시간 예약)
          this.stCell[0].name === this.edCell[0].name &&
          this.stCell[1].index === this.edCell[1].index
        ) {
          this.reservationInfo.name = this.stCell[0].name;
          this.reservationInfo.stHour = this.stCell[1].index;
          this.reservationInfo.edHour = this.stCell[1].index;

          this.dialog = true;
          this.stCell[1].selected = true;
          // this.stCell = "";
          // this.edCell = "";
        } else if (
          // 클릭 시 첫 셀의 방과 끝 셀의 방이 다른 경우 (두번째 클릭 시 초기화)
          this.rooms[this.room_indx].indexOf(this.stCell[0]) !=
          this.rooms[this.room_indx].indexOf(this.edCell[0])
        ) {
          // 끝 셀의 시간을 selected하고 첫 셀로 치환
          this.stCell[1].selected = false;
          this.edCell[1].selected = true;
          this.stCell = this.edCell;
          this.edCell = "";
        } else {
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
          this.reservationInfo.name = this.stCell[0].name;
          this.reservationInfo.stHour = stHour;
          this.reservationInfo.edHour = edHour;
          this.dialog = true;
        }
      } else {
        let stHour =
          this.edCell[1].index > this.stCell[1].index
            ? this.stCell[1].index
            : this.edCell[1].index;
        let edHour =
          this.edCell[1].index > this.stCell[1].index
            ? this.edCell[1].index
            : this.stCell[1].index;

        this.stCell[0].hours.forEach(e => {
          if (e.index >= stHour && e.index <= edHour) {
            e.selected = false;
          }
        });

        this.edCell = "";
        this.stCell = [room, hour];
        this.stCell[1].selected = true;

        this.reservationInfo.name = this.stCell[0].name;
        this.reservationInfo.stHour = stHour;
        this.reservationInfo.edHour = edHour;
      }
      // hour.selected = !hour.selected
    },
    makeReservation() {
      //this.currCell.selected = 2;
      let stHour =
        this.edCell[1].index > this.stCell[1].index
          ? this.stCell[1].index
          : this.edCell[1].index;
      let edHour =
        this.edCell[1].index > this.stCell[1].index
          ? this.edCell[1].index
          : this.stCell[1].index;
      //예약 API 호출

      this.stCell[0].hours.forEach(e => {
        if (e.index >= stHour && e.index <= edHour) {
          e.reserved = 2;
          e.selected = false;
          e.st_index = stHour;
          e.ed_index = edHour;
        }
      });
      this.stCell = "";
      this.edCell = "";
      this.dialog = false;

      console.log(this.rsvData);
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
    }
  },
  created() {
    for (var i = 0; i < this.room_src.length; i++) {
      this.rooms.push(
        this.room_src[i][1].map(e => ({
          name: e,
          hours: Array(12)
            .fill(0)
            .map((e, i) => ({
              index: i + 8,
              selected: false,
              reserved: 0,
              st_index: 0,
              ed_index: 0
            }))
        }))
      );
    }
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
.btn-emptyCell {
  color: #BDBDBD;
  background-color: #fff;
  border-color: #FAFAFA;
}

.btn-emptyCell:focus {
  color: #BDBDBD;
  background-color: #E6E6E6;
  border-color: #E6E6E6;
}

.btn-emptyCell:hover {
  color: #BDBDBD;
  background-color: #e6e6e6;
  border-color: #e6e6e6;
}

.btn-emptyCell:active {
  color: #BDBDBD;
  background-color: #E0F2F7;
  border-color: #e6e6e6;
}

.btn-clickedCell {
  color: #BDBDBD;
  background-color: #F5F6CE;
  border-color: #F5F6CE;
}

.btn-clickedCell:focus {
  color: #BDBDBD;
  background-color: #F5F6CE;
  border-color: #F5F6CE;
}

.btn-clickedCell:hover {
  color: #BDBDBD;
  background-color: #F3F781;
  border-color: #F3F781;
}

.btn-clickedCell:active {
  color: #BDBDBD;
  background-color: #F3F781;
  border-color: #F3F781;
}

.btn-bookedCell {
  color: #fff;
  background-color: #64A8F2;
  border-color: #64A8F2;
}

.btn-bookedCell:focus {
  color: #fff;
  background-color: #64A8F2;
  border-color: #64A8F2;
}

.btn-bookedCell:hover {
  color: #fff;
  background-color: #4071A4;
  border-color: #4071A4;
}

.btn-bookedCell:active {
  color: #fff;
  background-color: #4071A4;
  border-color: #4071A4;
}
</style>