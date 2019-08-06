<template>
  <v-card v-if="alert_detail.type='rsvError'" class="mx-auto" max-width="344" outlined>
    <v-list-item>
      <v-list-item-content>
        <div class="overline mb-4">Error({{alert_detail.type}})</div>
        <v-icon color="indigo" size="30">error</v-icon>
        <!-- <v-list-item>{{alert_detail.message}}</v-list-item> -->
        <div class="pl-10 pt-6">{{alert_detail.message}}</div>
      </v-list-item-content>
    </v-list-item>
    <v-card-actions class="justify-center">
      <v-btn width="100" color="#ddd" @click="closeModal">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["alert_detail"],
  methods: {
    closeModal() {
      this.$emit("closeModal");
    }
  },
  mounted() {
    // document.addEventListener("keydown", e => {
    //   if (e.keyCode == 27) {
    //     this.$emit("closeDialog");
    //     this.$emit("clearRsv");
    //   }
    // });
  }
};
</script>

<style>
</style>
