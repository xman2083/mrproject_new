<template>
  <v-card v-if="this.dialog">
    <v-card-title>
      <v-avatar color="indigo" size="40">
        <span
          class="white--text"
          style="font-size:15px;"
        >{{this.$store.state.room_src[room_indx][0]}}</span>
      </v-avatar>
      <span
        class="headline"
        style="color:grey !important;"
      >&nbsp;&nbsp;{{this.currCell[0].name}}&nbsp;&nbsp;</span>
      <!-- <span v-if="reserved">reserved</span>
      <span v-else>(test)not reserved</span>
      <span v-if="owner" style="color:red">(owner)</span>
      <span>{{rsvInput.stHour}} / {{rsvInput.edHour}}</span>-->
      <span class="grey--text subtitle-1">{{this.date}}</span>
    </v-card-title>
    {{ this.rsvInput.stHour}} / {{this.rsvInput.edHour}}
    <v-divider style="margin:0px;"></v-divider>
    <v-card-text style="padding:0;">
      <v-container grid-list-md>
        <!-- 해당 시간에 예약이 안되어 있는 경우 -->
        <v-layout v-if="reserved === false" wrap>
          <v-flex xs2>
            <v-text-field value="시작" readonly solo dark style="font-size:smaller;"></v-text-field>
          </v-flex>
          <v-flex xs10>
            <vue-timepicker
              v-model="selected_time.st"
              :minute-interval="30"
              style="padding: 5px;width:200px; font-size:20px; text-align:center !important;"
              hide-clear-button
            ></vue-timepicker>
          </v-flex>
          <v-flex xs2>
            <v-text-field value="종료" readonly solo dark style="font-size:smaller;"></v-text-field>
          </v-flex>
          <v-flex>
            <vue-timepicker
              v-model="selected_time.et"
              :minute-interval="30"
              style="padding: 5px;width:200px; font-size:20px;"
              hide-clear-button
            ></vue-timepicker>
          </v-flex>

          <!-- </v-flex>
          <v-flex xs3>
            <v-text-field
              suffix="시"
              :value="parseInt(rsvInput.stHour)"
              @click="timePicker('on')"
              solo
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              suffix="분"
              :value="rsvInput.stHour%1*60"
              @click="timePicker('on')"
              solo
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <td height="9px"></td>
            <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
              <v-icon
                dark
                v-on:click="timeControl('stHour','sub')"
                :disabled="rsvInput.stHour<=8?true:false"
              >remove</v-icon>
            </v-btn>
            <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
              <v-icon
                dark
                v-on:click="timeControl('stHour','add')"
                :disabled="rsvInput.stHour>19 || rsvInput.stHour >= rsvInput.edHour?true:false"
              >add</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs2>
            <v-text-field value="종료" readonly solo dark style="font-size:smaller;"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="시" :value="parseInt(rsvInput.edHour+0.5)" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="분" :value="(rsvInput.edHour+0.5)%1*60" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs4>
            <td height="9px"></td>
            <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
              <v-icon
                dark
                v-on:click="timeControl('edHour','sub')"
                :disabled="rsvInput.edHour<=8 || rsvInput.edHour <= rsvInput.stHour?true:false"
              >remove</v-icon>
            </v-btn>
            <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
              <v-icon
                dark
                v-on:click="timeControl('edHour','add')"
                :disabled="rsvInput.edHour>19?true:false"
              >add</v-icon>
            </v-btn>
          </v-flex>-->
          <v-flex xs6 sm6 md6>
            <v-text-field label="예약자 성명*" v-model="rsvInput.user_name" required readonly></v-text-field>
          </v-flex>
          <v-flex xs6 sm6 md6>
            <v-text-field label="휴대폰 번호" v-model="rsvInput.telNum" required readonly v-mask="mask"></v-text-field>
          </v-flex>

          <v-flex xs12 sm12 md12>
            <v-text-field v-if="dialog" autofocus required label="회의 주제*" v-model="rsvInput.title"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field label="회의 내용" v-model="rsvInput.content" clearable></v-text-field>
          </v-flex>
          <small>*필수 입력 사항 입니다.</small>
        </v-layout>

        <!-- 해당 시간에 예약이 되어 있는 경우 -->
        <v-layout v-if="reserved === true" wrap>
          <v-flex xs2>
            <v-text-field value="시작" readonly solo dark style="font-size:smaller;"></v-text-field>
            <time-picker></time-picker>
          </v-flex>
          <v-flex xs10>
            <vue-timepicker
              v-model="day.end_time"
              :minute-interval="30"
              style="padding: 1.3em 0.5em; width:60px; font-size:20px;"
            ></vue-timepicker>
          </v-flex>

          <!-- </v-flex>
          <v-flex xs3>
            <v-text-field suffix="시" :value="parseInt(rsvInput.stHour)" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="분" :value="rsvInput.stHour%1*60" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-btn
              v-if="owner"
              class="mx-2"
              fab
              dark
              depressed
              style="height:30px;width:30px;"
              color="grey"
            >
              <v-icon
                dark
                v-on:click="timeControl('stHour','sub')"
                :disabled="rsvInput.stHour<=8?true:false"
              >remove</v-icon>
            </v-btn>
            <v-btn
              v-if="owner"
              class="mx-2"
              fab
              dark
              depressed
              style="height:30px;width:30px;"
              color="grey"
            >
              <v-icon
                dark
                v-on:click="timeControl('stHour','add')"
                :disabled="rsvInput.stHour>19 || rsvInput.stHour >= rsvInput.edHour?true:false"
              >add</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs2>
            <v-text-field value="종료" readonly solo dark style="font-size:smaller;"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="시" :value="parseInt(rsvInput.edHour+0.5)" solo :readonly="!owner"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="분" :value="(rsvInput.edHour+0.5)%1*60" solo :readonly="!owner"></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-btn
              v-if="owner"
              class="mx-2"
              fab
              dark
              depressed
              style="height:30px;width:30px;"
              color="grey"
            >
              <v-icon
                dark
                v-on:click="timeControl('edHour','sub')"
                :disabled="rsvInput.edHour<=8 || rsvInput.edHour <= rsvInput.stHour?true:false"
              >remove</v-icon>
            </v-btn>
            <v-btn
              v-if="owner"
              class="mx-2"
              fab
              dark
              depressed
              style="height:30px;width:30px;"
              color="grey"
            >
              <v-icon
                dark
                v-on:click="timeControl('edHour','add')"
                :disabled="rsvInput.edHour>19?true:false"
              >add</v-icon>
            </v-btn>
          </v-flex>-->
          <v-flex xs6 sm6 md4>
            <v-text-field label="예약자 성명*" v-model="rsvInput.user_name" required readonly></v-text-field>
          </v-flex>
          <v-flex xs6 sm6 md4>
            <v-text-field label="휴대폰 번호" v-model="rsvInput.telNum" readonly v-mask="mask"></v-text-field>
          </v-flex>
          <v-flex xs8></v-flex>
          <v-flex xs4 md4>
            <v-btn v-if="!owner" color="indigo" dark small>전화하기</v-btn>
          </v-flex>

          <v-flex xs12 sm12 md12>
            <v-text-field
              v-if="dialog"
              :autofocus="!reserved"
              required
              label="회의 주제*"
              v-model="rsvInput.title"
              :clearable="owner"
              :readonly="!owner"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field
              label="회의 내용"
              v-model="rsvInput.content"
              :clearable="owner"
              :readonly="!owner"
            ></v-text-field>
          </v-flex>
          <small v-if="owner">*필수 입력 사항 입니다.</small>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="disabled" @click="closeDialog">닫기</v-btn>
      <v-btn
        color="warning"
        v-if="currCell !== '' && (currCell[1].reserved === 2 || currCell[1].reserved === 3) && owner"
        @click="cnclReservation()"
      >예약 취소</v-btn>
      <v-btn
        v-if="currCell !== '' && (currCell[1].reserved === 2 || currCell[1].reserved === 3) && owner"
        color="indigo"
        dark
        @click="updateReservation()"
      >예약 수정</v-btn>
      <v-btn
        v-if="currCell !== '' && (currCell[1].reserved === 0)"
        color="indigo"
        dark
        @click="makeReservation()"
      >예약 하기</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import VueTimepicker from "vue2-timepicker";
import { mapGetters } from "vuex";
import { mask } from "vue-the-mask";

export default {
  data() {
    return {
      reserved: false,
      owner: false,
      mask: "###-####-####"
    };
  },
  props: [
    "rsvInput",
    "room_indx",
    "rooms",
    "date",
    "dialog",
    "currCell",
    "selected_time"
  ],
  components: {
    VueTimepicker
  },

  directives: {
    mask
  },

  methods: {
    makeReservation() {
      this.$emit("makeReservation");
    },
    cnclReservation() {
      this.$emit("cnclReservation");
    },
    updateReservation() {
      this.$emit("updateReservation");
    },
    closeDialog() {
      this.$emit("closeDialog");
      this.$emit("clearRsv");
    },
    timeControl(val, cal) {
      this.$emit("timeControl", val, cal);
    },
    rsvAvailableCheck() {
      this.$emit("rsvAvailableCheck");
    }
    // timePicker(status) {
    //   this.$emit("timePicker", status);
    // }
  },
  beforeUpdate() {
    this.owner = false;
    console.log("RsvPopupForm >> beforeUpdate");
    if (this.dialog) {
      if (this.currCell[1].rsv_key) {
        // console.log(this.currCell[1].rsv_key);
        this.reserved = true;
        this.$emit("updateRsv");
        // this.rsvInput = this.getRsvDataStore[this.currCell[1].rsv_key];
      } else {
        this.reserved = false;
      }
      if (
        this.rsvInput.telNum.replace("-", "").replace("-", "") ===
        this.$store.state.user.tel_num
      ) {
        this.owner = true;
      }
    }
  },
  mounted() {
    // Close modal with 'esc' key
    document.addEventListener("keydown", e => {
      if (e.keyCode == 27) {
        this.$emit("closeDialog");
        this.$emit("clearRsv");
      }
    });

    // if (this.currCell[1]) {
    //   console.log(this.currCell[1].rsv_key);
    // }
  },
  computed: {
    ...mapGetters(["getRsvDataStore"])
  }
};
</script>

<style>
</style>
