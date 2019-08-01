<template>
  <v-card v-if="this.dialog" @keydown.esc="dialogChange">
    <v-card-title>
      <v-avatar color="indigo" size="36">
        <span class="white--text">{{this.$store.state.room_src[room_indx][0]}}</span>
      </v-avatar>
      <span
        class="headline"
        style="color:grey !important;"
      >&nbsp;&nbsp;{{this.currRoom.name}}&nbsp;&nbsp;</span>
      <span v-if="reserved">reserved</span>
      <span v-else>(test)not reserved</span>
      <span v-if="owner" style="color:red">(owner)</span>
      <span class="grey--text subtitle-1">{{this.date}}</span>
    </v-card-title>
    <v-divider style="margin:0px;"></v-divider>
    <v-card-text style="padding:0;">
      <v-container grid-list-md>
        <!-- 해당 시간에 예약이 안되어 있는 경우 -->
        <v-layout v-if="reserved === false" wrap>
          <v-flex xs2>
            <v-text-field value="S" readonly solo dark></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="시" :value="parseInt(rsvInput.stHour)" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="분" :value="rsvInput.stHour%1*60" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
              <v-icon
                dark
                v-on:click="rsvInput.stHour-=0.5"
                :disabled="rsvInput.stHour<=8?true:false"
              >remove</v-icon>
            </v-btn>
            <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
              <v-icon
                dark
                v-on:click="rsvInput.stHour+=0.5"
                :disabled="rsvInput.stHour>19 || rsvInput.stHour >= rsvInput.edHour?true:false"
              >add</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs2>
            <v-text-field value="E" readonly solo dark></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="시" :value="parseInt(rsvInput.edHour+0.5)" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="분" :value="(rsvInput.edHour+0.5)%1*60" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
              <v-icon
                dark
                v-on:click="rsvInput.edHour-=0.5"
                :disabled="rsvInput.edHour<=8 || rsvInput.edHour <= rsvInput.stHour?true:false"
              >remove</v-icon>
            </v-btn>
            <v-btn class="mx-2" fab dark depressed style="height:30px;width:30px;" color="grey">
              <v-icon
                dark
                v-on:click="rsvInput.edHour+=0.5"
                :disabled="rsvInput.edHour>19?true:false"
              >add</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs6 sm6 md6>
            <v-text-field label="예약자 성명*" v-model="rsvInput.user_name" required clearable></v-text-field>
          </v-flex>
          <v-flex xs6 sm6 md6>
            <v-text-field label="휴대폰 번호" v-model="rsvInput.telNum" required clearable></v-text-field>
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
            <v-text-field value="S" readonly solo dark></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="시" :value="parseInt(rsvLoaded.stHour)" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="분" :value="rsvLoaded.stHour%1*60" solo readonly></v-text-field>
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
                v-on:click="rsvLoaded.stHour-=0.5"
                :disabled="rsvLoaded.stHour<=8?true:false"
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
                v-on:click="rsvLoaded.stHour+=0.5"
                :disabled="rsvLoaded.stHour>19 || rsvLoaded.stHour >= rsvLoaded.edHour?true:false"
              >add</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs2>
            <v-text-field value="E" readonly solo dark></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              suffix="시"
              :value="parseInt(rsvLoaded.edHour+0.5)"
              solo
              :readonly="!owner"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="분" :value="(rsvLoaded.edHour+0.5)%1*60" solo :readonly="!owner"></v-text-field>
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
                v-on:click="rsvLoaded.edHour-=0.5"
                :disabled="rsvLoaded.edHour<=8 || rsvLoaded.edHour <= rsvLoaded.stHour?true:false"
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
                v-on:click="rsvLoaded.edHour+=0.5"
                :disabled="rsvLoaded.edHour>19?true:false"
              >add</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs6 sm6 md4>
            <v-text-field
              label="예약자 성명*"
              v-model="rsvLoaded.user_name"
              required
              :clearable="owner"
              :readonly="!owner"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 sm6 md4>
            <v-text-field
              label="휴대폰 번호"
              v-model="rsvLoaded.telNum"
              :clearable="owner"
              :readonly="!owner"
            ></v-text-field>
          </v-flex>
          <v-flex md4>
            <v-btn v-if="!owner" color="indigo" dark small>전화하기</v-btn>
          </v-flex>

          <v-flex xs12 sm12 md12>
            <v-text-field
              v-if="dialog"
              :autofocus="!reserved"
              required
              label="회의 주제*"
              v-model="rsvLoaded.title"
              :clearable="owner"
              :readonly="!owner"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field
              label="회의 내용"
              v-model="rsvLoaded.content"
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
      <v-btn color="disabled" @click="dialogChange">닫기</v-btn>
      <v-btn
        color="warning"
        v-if="currCell !== '' && (currCell[1].reserved === 2 || currCell[1].reserved === 3) && owner"
        @click="cnclReservation()"
      >예약취소</v-btn>
      <v-btn
        v-if="currCell !== '' && (currCell[1].reserved === 2 || currCell[1].reserved === 3) && owner"
        color="primary"
        @click="updateReservation()"
      >예약 수정</v-btn>
      <v-btn
        v-if="currCell !== '' && (currCell[1].reserved === 0)"
        color="primary"
        @click="makeReservation()"
      >예약</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      reserved: false,
      owner: false,
      rsvLoaded: {
        date: "",
        user_id: "",
        user_name: "",
        telNum: "",
        room_id: "",
        title: "",
        content: "",
        stHour: 0,
        edHour: 0,
        id: ""
      }
    };
  },
  props: [
    "rsvInput",
    "room_indx",
    "date",
    "dialog",
    "currCell",
    "currRoom",
    "dialog"
  ],
  methods: {
    makeReservation() {
      this.$emit("makeReservation", this.rsvLoaded);
    },
    cnclReservation() {
      this.$emit("cnclReservation", this.rsvLoaded);
    },
    updateReservation() {
      this.$emit("updateReservation", this.rsvLoaded);
    },
    dialogChange() {
      this.$emit("dialogChange");
    }
  },
  beforeUpdate() {
    console.log("RsvPopupForm >> beforeUpdate");
    if (this.dialog) {
      if (this.currCell[1].rsv_key) {
        console.log(this.currCell[1].rsv_key);
        this.reserved = true;
        this.rsvLoaded = this.getRsvDataStore[this.currCell[1].rsv_key];
        console.log(this.rsvLoaded);
      } else {
        this.reserved = false;
        this.rsvLoaded = {};
      }
      if (this.rsvLoaded.telNum === this.$store.state.user.tel_num) {
        this.owner = true;
      }
    }
  },
  mounted() {
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
