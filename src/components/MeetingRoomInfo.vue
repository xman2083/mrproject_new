<template>
  <v-card class="mx-auto" max-width="600">
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
      >&nbsp;&nbsp;{{this.currRoom.name}} &nbsp;&nbsp;</span>
      <!-- <span>&nbsp;st: {{this.rsvInput.stHour}} / ed: {{this.rsvInput.edHour}}</span> -->
    </v-card-title>
    <v-img v-bind:src="currRoom.img_src" width="600px"></v-img>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="closeMrPopup" dark depressed color="#364f6b">닫기</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      src_path: ""
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
