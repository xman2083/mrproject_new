<template>
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
      <span class="grey--text subtitle-1">{{this.date}}</span>
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
          <v-checkbox v-model="checkbox" :label="`반복 예약`"></v-checkbox>
          <v-flex xs12 sm6 d-flex>
            <v-select v-if="checkbox" v-model="rsvInput.rsv_type" :items="items"></v-select>
          </v-flex>
          <small>*필수 입력 사항 입니다.</small>
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
          <v-checkbox v-model="checkbox" :label="`반복예약`"></v-checkbox>
          <v-flex xs12 sm6 d-flex>
            <v-select v-if="checkbox" v-model="rsvInput.rsv_type" :items="items"></v-select>
          </v-flex>
          <small v-if="owner">*필수 입력 사항 입니다.</small>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn width="80" color="#f5f5f5" style="color:#364f6b" depressed @click="closeDialog">닫기</v-btn>
      <v-btn
        color="#fc5185"
        width="80"
        v-if="currCell !== '' && (currCell[1].reserved === 3) && owner"
        @click="cnclReservation"
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
      mask: "###-####-####",
      cell_time: {},
      rules: {
        required: value => !!value || "필수입력 사항입니다.",
        counter: value => value.length <= 25 || "최대 25자까지 입력가능합니다."
      },
      items: [{ text: "매일", value: 0 }, { text: "매주", value: 1 }],
      checkbox: false,
      test: ""
    };
  },
  props: [
    "rsvInput",
    "room_indx",
    "rooms",
    "date",
    "dialog",
    "currCell",
    "selected_time",
    "rsvDataRes"
  ],
  components: {
    VueTimepicker
  },

  directives: {
    mask
  },

  methods: {
    makeReservation() {
      this.$emit("makeReservation", this.cell_time);
    },
    cnclReservation() {
      this.$emit("cnclReservation");
    },
    updateReservation() {
      this.$emit("updateReservation", this.cell_time);
    },
    closeDialog() {
      this.checkbox = false;
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
    Object.assign(this.cell_time, this.selected_time);
    this.owner = false;
    console.log(this.currCell);
    console.log("RsvPopupForm >> beforeUpdate");
    if (this.dialog) {
      if (this.currCell[1].reserved === 2 || this.currCell[1].reserved === 3) {
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
  },
  mounted() {
    // Close modal with 'esc' key
    document.addEventListener("keydown", e => {
      if (e.keyCode == 27) {
        this.$emit("closeDialog");
        this.$emit("clearRsv");
      }
    });
  },
  computed: {
    ...mapGetters(["getRsvDataStore"])
  },
  created() {}
};
</script>

<style>
</style>
