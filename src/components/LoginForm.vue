<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="login" label="휴대폰 번호" type="text" v-model="telNum" v-bind:disabled="isOtpSent"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" label="OTP" type="text" v-model="otpNum" v-bind:disabled="!isOtpSent"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" v-on:click="initForm">초기화</v-btn>
                <v-spacer></v-spacer>
                <span v-if="isOtpSent" >{{ countDown }}</span>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-on:click="submitForm">{{ btnText }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import bus from '../utils/bus.js';

  export default {
    data: () => ({
      drawer: null,
      btnText: 'OTP 전송',
      isOtpSent: false,
      otpTime: 180,
      telNum: '',
      otpNum: ''
    }),
    computed: {
      countDown: function() {
        return this.otpTime/60 + ' : ' + ('0' + this.otpTime%60).slice(-2);
      }
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
            const response = await this.$store.dispatch('LOGIN', {
              tel_num: this.telNum,
              otp_num: this.otpNum,
            });
            console.log(response);
            alert(response.data.message);
            if (response.data.statusCode == 200) {
              bus.$emit('show:toast', response.data.message);
              this.$router.push('/');
              this.initForm();
            }
          }
          else {
            if (!this.telNum) {
              alert('전화번호를 입력하세요.');
              return;
            }
            const response = await this.$store.dispatch('SENDOTP', {
              tel_num: this.telNum,
            });
            this.btnText = 'OTP 확인';
            this.isOtpSent = true;
            console.log(response);
          }
        } catch (error) {
          console.log(error);
          //this.logMessage = error.response.data;
        }
      },
      initForm() {
        this.telNum = '';
        this.otpNum = '';
        this.btnText = 'OTP 전송';
        this.isOtpSent = false;
      },
    }
  }
</script>
