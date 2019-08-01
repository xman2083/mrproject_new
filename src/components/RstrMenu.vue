<template>


<div>
  <v-tabs
    color="cyan darken-2"
    dark
    next-icon="fas fa-chevron-right"
    prev-icon="fas fa-chevron-left"
    show-arrows
  >
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab
      v-for="place in places"
      :key="place"
    >
     {{ place }}
    </v-tab>

    <v-tabs-items>
      <v-tab-item
        v-for="place in places"
        :key="place"
      >
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>

  <v-tabs
    color="cyan"
    dark
    next-icon="fas fa-chevron-right"
    prev-icon="fas fa-chevron-left"
    show-arrows
  >
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab
      v-for="date in dates"
      :key="date"
    >
     {{ date }}
    </v-tab>

    <v-tabs-items>
      <v-tab-item
        v-for="date in dates"
        :key="date"
      >
        <v-card flat>
          <v-card-text>{{ text }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</div>
</template>

<script>
  export default {
    data () {
      return {
        text: 'Lorem ipsum dolor sit amet, .',
        places: ['남산', '보라매'],
        dates: ['7/29(월)', '7/30(화)', '7/31(수)', '8/1(목)', '8/2(금)']
      }
    }
  }
</script>

<style>

</style>
