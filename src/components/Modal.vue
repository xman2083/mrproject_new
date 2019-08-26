<template>
  <div>
    <v-card v-if="alert_detail.type=='error'" class="mx-auto" max-width="344" outlined>
      <v-list-item>
        <v-list-item-content>
          <div class="overline mb-4">{{alert_detail.type}}</div>
          <v-icon color="indigo" size="30">error</v-icon>
          <!-- <v-list-item>{{alert_detail.message}}</v-list-item> -->
          <div class="pl-10 pt-6">{{alert_detail.message}}</div>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions class="justify-center">
        <v-btn width="100" color="#ddd" @click="closeModal" depressed>OK</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="alert_detail.type=='check'" class="mx-auto" max-width="344" outlined>
      <v-list-item>
        <v-list-item-content>
          <div class="overline mb-4">{{alert_detail.type}}</div>
          <v-icon color="indigo" size="30">error</v-icon>
          <!-- <v-list-item>{{alert_detail.message}}</v-list-item> -->
          <div class="pl-10 pt-6">{{alert_detail.message}}</div>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions class="justify-center">
        <v-btn width="100" color="#ddd" @click="closeModal(null)" depressed>No</v-btn>
        <v-btn width="100" color="#fc5185" @click="closeModal('check')" depressed dark>Yes</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["alert_detail"],
  methods: {
    closeModal(check) {
      this.$emit("closeModal", check);
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
