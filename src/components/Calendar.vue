<template>
  <div>
    <v-flex xs12 sm6 md4>
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="date"
        persistent
        lazy
        full-width
        width="290px"
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
        <v-date-picker v-model="date" scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
        </v-date-picker>
      </v-dialog>
    </v-flex>

    <v-container fluid>
      <v-layout wrap>
        <v-flex xs12 sm6 md4>
          <v-combobox
            v-model="choose"
            :items="items"
            chips
            label="층/빔 선택"
          ></v-combobox>
        </v-flex>
      </v-layout>
    </v-container>

    <div class="container">
      <div class="panel">
        <div class="panel-body">
          <div class="row">
            <div class="col-md-2 col-sm-4 col-xs-4" v-for="room in rooms">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>{{room.name}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hour in room.hours" class="hour" :class="{ selected: hour.selected }">
                    <td @click="select(hour)">{{hour.index}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Legal first name*" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email*" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password*" type="password" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Age*"
                  required
                ></v-select>
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
          <v-btn color="blue darken-1" flat v-if="currCell.selected" v-on:click="cnclReservation">예약취소</v-btn>
          <v-btn color="blue darken-1" flat v-on:click="makeReservation">예약</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        date: new Date().toISOString().substr(0, 10),
        menu: false,
        modal: false,
        menu2: false,

        choose: '16층',
        items: [
          '16층',
          '17층',
          '2층',
          '빔'
        ],

        dialog: false,

        currCell: {},
        rooms: ['몽블랑', '킬리만자로', '남산', '티티카카', '로체', '안산', '아차산', '한라산'].map(e => ({
          name: e,
          hours: Array(13).fill(0).map((e, i) => ({
            index: i + 8,
            //disp: (i + 8) / ,
            selected: false
          }))
        }))
      }
    },
    methods: {
      select(e) {
        this.currCell = e;
        this.dialog = true;
      },
      makeReservation(e) {
        this.currCell.selected = true;
        this.dialog = false;
      },
      cnclReservation(e) {
        this.currCell.selected = false;
        this.dialog = false;
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .hour {
    color: #bbb;
    cursor: pointer;
  }
  .selected {
    background-color: #0aa8ce;
    color: white;
  }
  .table > tbody > tr.selected > td {
    border-top: 1px solid #0aa8ce;
  }
  .selected td:hover {
    background-color: #0a89af;
    color: white;
  }
</style>