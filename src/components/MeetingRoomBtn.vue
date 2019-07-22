<template>
  <div>
    <v-tabs v-on:change="tabChanged"
      v-model="active"
      color="cyan"
      dark
      slider-color="yellow"
    >
      <v-tab
        v-for="room in room_src"
        :key="room[2]"
        ripple
      >
        {{ room[0] }}

      </v-tab>
      <v-tab-item
        v-for="room in room_src"
        :key="room[2]"
      >
      </v-tab-item>
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
          <v-text-field
            v-model="date"
            label="날짜선택"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
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
                  <th><button type="button" class="btn btn-info btn-block">회의실</button></th>
              
                  <th><button type="button" class="btn btn-info btn-block">시간</button></th>
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
                        <button type="button" class="btn btn-block pl-1 pr-1"
                          :class="{ 'btn-secondary': (hour.reserved ===4 ),
                                    'btn-primary': (hour.reserved === 2 || hour.reserved === 3),
                                    'btn-info': (hour.reserved === 1),
                                    'btn-default': (hour.reserved === 0),
                                    'btn-success': (hour.selected) }"
                          v-on:click="cellClick(room, hour)">
                          <span style="font-size: smaller; text-align: center;">
                            {{hour.index}}
                          </span>
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

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">회의실 예약</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 >
                <v-text-field label="제목" required></v-text-field>
              </v-flex>
              
              <!-- <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email*" required></v-text-field>
              </v-flex> -->
              <v-flex>
                <div> 예약자번호:{{this.$store.state.user}} </div>
              </v-flex>
              
              <v-flex xs12>
                <v-text-field label="이용시간" type="date" required></v-text-field>
              </v-flex>
             
              <v-flex xs12 >
                <div>
                  <select id="room" name="room" v-model="selectedDate">
                    <option v-for="room in room_src" v-bind:selected="room" == "'아차산'"></option>
                  </select>
                </div>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">닫기</v-btn>
          <v-btn color="blue darken-1" flat v-if="currCell !== '' && (currCell[1].reserved === 2 || currCell[1].reserved === 3)" v-on:click="cnclReservation">예약취소</v-btn>
          <v-btn color="blue darken-1" flat v-on:click="makeReservation">예약</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  // import ConstantValues from '../utils/constant-values.js'
  export default {
    data () {
      return {
        date: new Date().toISOString().substr(0, 10),
        menu: false,
        modal: false,

        dialog: false,
        room_src: [
          ['16층', ['몽블랑', '킬리만자로', '남산', '티티카카', '아차산', '한라산', 'A', 'B'], 0],
          ['17층', ['1회의실', '2회의실', '3회의실', '4회의실', '5회의실', '6회의실'], 1],
          ['2층', ['접견실'], 2],
          ['보라매', ['하와이', '발리', '몰디브', '8층 회의실', '개발실'], 3],
          ['빔-남산', ['빔1', '빔2', '빔3', '무선 MIC1', '무선 MIC2', '무선 Pin MIC', 'Class Cam'], 4],
          ['빔-보라매', ['빔1', '빔2'], 5],
        ],
        room_indx: 0,

        currCell: '',
        stCell: '',
        edCell: '',
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
      }
    },
    methods: {
      cellClick(room, hour) {
        //if hour.reserved
        console.log(this.room_indx, room.name, this.rooms[this.room_indx].indexOf(room), hour.index, hour.selected);
        console.log(window.innerWidth);

        this.currCell = [room, hour];

        if (hour.reserved === 2 || hour.reserved === 3) {
          this.dialog = true;
          return;
        }

        if (this.stCell === '') {
          this.stCell = [room, hour];
          this.stCell[1].selected = true;
        }
        else if (this.edCell === '') {
          this.edCell = [room, hour];
          if (this.stCell[0].name === this.edCell[0].name &&
              this.stCell[1].index === this.edCell[1].index) {
            this.stCell[1].selected = false;
            this.stCell = '';
            this.edCell = '';
          }
          else if (this.rooms[this.room_indx].indexOf(this.stCell[0]) != this.rooms[this.room_indx].indexOf(this.edCell[0])) {
            this.stCell[1].selected = false;
            this.edCell[1].selected = true;
            this.stCell = this.edCell;
            this.edCell = '';
          }
          else {
            let stHour = this.edCell[1].index > this.stCell[1].index ? this.stCell[1].index : this.edCell[1].index;
            let edHour = this.edCell[1].index > this.stCell[1].index ? this.edCell[1].index : this.stCell[1].index;

            this.edCell[1].selected = true;
            console.log(stHour, edHour, room.hours);
            room.hours.forEach((e) => {
              if (e.index > stHour && e.index < edHour) {
                e.selected = true;
              }
            });
            this.dialog = true;
          }
        }
        else {
          let stHour = this.edCell[1].index > this.stCell[1].index ? this.stCell[1].index : this.edCell[1].index;
          let edHour = this.edCell[1].index > this.stCell[1].index ? this.edCell[1].index : this.stCell[1].index;

          this.stCell[0].hours.forEach((e) => {
            if (e.index >= stHour && e.index <= edHour) {
              e.selected = false;
            }
          });

          this.edCell = '';
          this.stCell = [room, hour];
          this.stCell[1].selected = true;
        }
        // hour.selected = !hour.selected
      },
      makeReservation() {
        //this.currCell.selected = 2;
        let stHour = this.edCell[1].index > this.stCell[1].index ? this.stCell[1].index : this.edCell[1].index;
        let edHour = this.edCell[1].index > this.stCell[1].index ? this.edCell[1].index : this.stCell[1].index;
        //예약 API 호출

        this.stCell[0].hours.forEach((e) => {
          if (e.index >= stHour && e.index <= edHour) {
            e.reserved = 2;
            e.selected = false;
            e.st_index = stHour;
            e.ed_index = edHour;
          }
        });
        this.stCell = '';
        this.edCell = '';
        this.dialog = false;
      },
      cnclReservation() {
        //예약 취소 API 호출
        let stHour = this.currCell[1].st_index;
        let edHour = this.currCell[1].ed_index;

        this.currCell[0].hours.forEach((e) => {
          if (e.index >= stHour && e.index <= edHour) {
            e.reserved = 0;
            e.selected = false;
            e.st_index = 0;
            e.ed_index = 0;
          }
        });
        this.currCell = '';
        this.dialog = false;
      },
      closeReservation() {

      },
      swipeHandler(direction) {
        console.log(direction);
        if (direction == 'left') {
          // this.room_indx += 1;
          // if (this.room_indx >= this.room_src.length) {
          //   this.room_indx = 0;
          // }
        }
        else if (direction == 'right') {
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
        console.log('st:' + hour.index);
      },
      endHourSel(room, hour) {
        console.log('ed:' + hour.index);
      }
    },
    created() {
      for(var i=0; i<this.room_src.length; i++) {
        this.rooms.push(this.room_src[i][1].map(e => ({
          name: e,
          hours: Array(12).fill(0).map((e, i) => ({
            index: i + 8,
            selected: false,
            reserved: 0,
            st_index: 0,
            ed_index: 0
          }))
        })));
      }
    }
  }
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

</style>