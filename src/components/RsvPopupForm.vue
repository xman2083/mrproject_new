<template>
  <v-card>
    <v-card-title>
      <v-avatar color="indigo" size="36">
        <span
          class="white--text"
          style="font-size:smaller;"
        >{{this.$store.state.room_src[room_indx][0]}}</span>
      </v-avatar>
      <span class="headline" style="color:grey !important;">&nbsp;&nbsp;회의실 예약하기&nbsp;&nbsp;</span>
      <span class="grey--text subtitle-1">{{this.date}}</span>
      <!-- <span>&nbsp;st: {{this.rsvInput.stHour}} / ed: {{this.rsvInput.edHour}}</span> -->
      <span>&nbsp;stHour: {{this.rsvInput.stHour}} / edHour: {{this.rsvInput.edHour}}</span>
    </v-card-title>
    <v-divider style="margin:0px;"></v-divider>
    <v-card-text style="padding:0;">
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs3>
            <v-text-field dark solo value="회의실" style="font-size:smaller;"></v-text-field>
          </v-flex>
          <v-flex xs9>
            <v-text-field v-model="rsvInput.room_name" readonly solo></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field style="font-size:smaller;" value="시작" readonly solo dark></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="시" :value="parseInt(rsvInput.stHour)" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="분" :value="rsvInput.stHour%1*60" solo readonly></v-text-field>
          </v-flex>
          <v-flex xs3>
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
          <v-flex xs3>
            <v-text-field value="종료" style="font-size:smaller;" readonly solo dark></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="시" :value="parseInt(rsvInput.edHour+0.5)" solo></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field suffix="분" :value="(rsvInput.edHour+0.5)%1*60" solo></v-text-field>
          </v-flex>
          <v-flex xs3>
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
            <v-text-field label="휴대폰 번호" v-model="rsvInput.telNum"></v-text-field>
          </v-flex>
          <!-- <v-flex xs2 sm2 md2>
                <a :href="`tel:+${ rsvInput.telNum }`">
                  <v-icon color="red" x-large>phone</v-icon>
                </a>
          </v-flex>-->

          <v-flex xs12 sm12 md12>
            <v-text-field v-if="dialog" autofocus required label="회의 주제*" v-model="rsvInput.title"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-text-field label="회의 내용" v-model="rsvInput.content" clearable></v-text-field>
          </v-flex>
          <small>*필수 입력 사항 입니다.</small>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="disabled" @click="dialogChange">닫기</v-btn>
      <v-btn
        color="warning"
        v-if="currCell !== '' && (currCell[1].reserved === 2 || currCell[1].reserved === 3)"
        v-on:click="cnclReservation"
      >예약취소</v-btn>
      <v-btn color="primary" v-on:click="makeReservation">예약</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["rsvInput", "room_indx", "date", "dialog", "currCell"],
  methods: {
    makeReservation() {
      this.$emit("makeReservation");
    },
    cnclReservation() {
      this.$emit("cnclReservation");
    },
    dialogChange() {
      this.$emit("dialogChange");
    }
  }
};
</script>

<style>
</style>
