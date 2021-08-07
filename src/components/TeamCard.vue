<template>
  <v-card
    class="mx-auto"
    max-width="200"
  >
    <v-img
      :src="require(`../assets/${imageName}`)"
      height="200px"
      width="200px"
    ></v-img>

    <v-card-title class="justify-center">
      {{ title }}
    </v-card-title>

    <v-card-subtitle>
      {{ subtitle }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        color="orange lighten-2"
        text
        @click="show = !show"
      >
        Mer info
      </v-btn>

      <v-spacer></v-spacer>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          {{ expandText }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    title: String,
    subtitle: String,
    expandText: String,
    imageName: String,
  },
  data: () => {
    return {
      show: false,
    };
  },
});
</script>

<style scoped></style>
