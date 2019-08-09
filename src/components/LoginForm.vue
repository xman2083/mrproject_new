<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs10 sm6 md4>
            <v-card class="elevation-12">
              <v-toolbar flat color="#3fc1c9" style="color:white">
                <v-toolbar-title style="color:#white">Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="login"
                    label="휴대폰 번호"
                    type="number"
                    color="#3fc1c9"
                    v-model="telNum"
                    v-bind:disabled="isOtpSent"
                    v-on:keyup.enter="submitForm"
                    autofocus
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="본인 인증 번호"
                    type="number"
                    color="#3fc1c9"
                    v-model="otpNum"
                    v-bind:disabled="!isOtpSent"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="#3fc1c9" style="color:white" v-on:click="initForm">초기화</v-btn>
                <v-spacer></v-spacer>
                <!-- <span v-if="isOtpSent" >{{ countDown }}</span> -->
                <!-- __Jungmi__ CountdownTimer호출 -->
                <span v-if="isOtpSent">
                  <CountdownTimer v-on:toolate="latealert"></CountdownTimer>
                </span>
                <v-spacer></v-spacer>
                <v-btn color="#364f6b" style="color:white" v-on:click="submitForm">{{ btnText }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import bus from "../utils/bus.js";
import { setInterval, clearInterval } from "timers";
import CountdownTimer from "./OTPTimer.vue";

export default {
  data: () => ({
    drawer: null,
    btnText: "SMS 인증",
    isOtpSent: false,
    otpTime: 10,
    telNum: "",
    otpNum: ""
  }),
  // computed: {
  //  countDown: function() {
  //     if (this.otpTime === 0)
  //       return 'OTP 만료됨'
  //     else
  //       return Math.trunc(this.otpTime/60) + ' : ' + ('0' + this.otpTime%60).slice(-2);
  //   }
  // },

  // __Jungmi__ CountdownTimer 등록
  components: {
    CountdownTimer
  },

  props: {
    source: String
  },
  methods: {
    async submitForm() {
      // if (!this.username || !this.password) {
      //   alert('Fill in the account information');
      //   return;
      // }
      try {
        if (this.isOtpSent) {
          const response = await this.$store.dispatch("LOGIN", {
            tel_num: this.telNum,
            otp_num: this.otpNum
          });
          console.log(response);
          alert(response.data.message);
          if (response.data.statusCode == 200) {
            bus.$emit("show:toast", response.data.message);
            this.$router.push("/meetingroombtn");
            this.initForm();
          }
        } else {
          if (!this.telNum) {
            alert("전화번호를 입력하세요.");
            return;
          }
          const response = await this.$store.dispatch("SENDOTP", {
            tel_num: this.telNum
          });
          if (response.data.statusCode == 200) {
            this.btnText = "SMS 확인";
            this.isOtpSent = true;
            this.timeInterval = setInterval(
              function() {
                // This will be executed after 1,000 milliseconds
                // if (this.otpTime > 0) {
                //   this.otpTime--;
                //   console.log(this.otpTime);
                // }
                // else clearInterval(this.timeInterval);
              }.bind(this),
              1000
            );
          } else if (response.data.statusCode == 204) {
            alert("가입자 정보가 없습니다.");
          } else {
            alert("SMS 전송에 실패했습니다.");
          }
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        //this.logMessage = error.response.data;
      }
    },
    initForm() {
      this.telNum = "";
      this.otpNum = "";
      this.btnText = "SMS 전송";
      this.isOtpSent = false;
      this.otpTime = 180;
      if (this.timeInterval) clearInterval(this.timeInterval);
    },
    // __Jungmi__ Timeover alert
    latealert() {
      this.isOtpSent = false;
      this.timeover = true;
      // this.initForm();
      this.btnText = "SMS 전송";
      alert("느져쓰");
    }
  },
  beforeDestroy: function() {
    this.initForm();
  }
};
</script>
