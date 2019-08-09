<template>
  <v-footer
    dark
    padless
  >
    <v-card
      class="flex"
      flat
      tile
      color="#3fc1c9"
    >
      <v-card-title>
    <img style="width:80px;" src="../assets/sktl_logo.png"></img>

        <v-spacer></v-spacer>

        <!-- <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4"
          dark
          icon
        >
          <v-icon size="20px">{{ icon }}</v-icon>
        </v-btn> -->
      </v-card-title>

      <v-card-text style="font-size:0.8rem">
        Copyrightⓒ {{ new Date().getFullYear() }} — All rights reserved by SK telink
                <p style="font-size:0.5rem;">
            made by SKtelink Platform Dev.  <a style="text-decoration:none !important" href="mailto:tabasco@sk.com">Please contact us</a>
      </p>
      </v-card-text>

    </v-card>
  </v-footer>
  <!-- <v-footer
    dark
    padless
    color="#364f6b"
  >
<v-layout align-center justify-center wrap>
  <v-flex xs12 >     
      <v-card flat color="#3fc1c9">      <img style="width:6rem;padding:1rem"
      src="../assets/sktl_logo.png"></img></v-card>   </v-flex>

<v-flex xs12>
      <v-card flat color="#364f6b">Copyrightⓒ
        {{ new Date().getFullYear() }} — All rights reserved by SK telink
      </v-card>
      </v-flex>
      </v-layout>
  </v-footer> -->
</template>

<script>
export default {
// data() {
//     return {       
//         icons: [
//         'fab fa-facebook',
//         'fab fa-twitter',
//         'fab fa-google-plus',
//         'fab fa-linkedin',
//       ],};
//   }
}

</script>

<style></style>