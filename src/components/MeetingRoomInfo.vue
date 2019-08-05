<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-title>
      <v-avatar color="indigo" size="36">
        <span
          class="white--text"
          style="font-size:smaller;"
        >{{this.$store.state.room_src[room_indx][0]}}</span>
      </v-avatar>
      <span
        class="headline"
        style="color:grey !important;"
      >&nbsp;&nbsp;{{this.currRoom.name}} 회의실 정보 &nbsp;&nbsp;</span>
      <!-- <span>&nbsp;st: {{this.rsvInput.stHour}} / ed: {{this.rsvInput.edHour}}</span> -->
    </v-card-title>
    <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px"></v-img>

    <v-card-actions>
      <v-btn text>Share</v-btn>

      <v-btn @click="closeMrPopup" text color="primary">닫기</v-btn>

      <v-spacer></v-spacer>

      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-card-text>I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.</v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      show: false
    };
  },
  methods: {
    closeMrPopup() {
      this.$emit("closeMrPopup");
    }
  },
  props: ["room_indx", "rsvInput", "currRoom"],
  mounted() {
    document.addEventListener("keydown", e => {
      if (e.keyCode == 27) {
        this.$emit("closeMrPopup");
      }
    });
  }
};
</script>

<style>
</style>
