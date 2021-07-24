<template>
  <v-app class="grid">
    <v-app-bar app color="#061838" dark style="height: 90px">
      <div class="d-flex align-center margin">
        <v-img
          alt="Paralvlympics Logo"
          class="shrink mr-2"
          contain
          src="./assets/paralvlympics-logo.png"
          transition="scale-transition"
          width="110"
        />
      </div>

      <v-spacer></v-spacer>
      <div class="margin">
        <v-select
          :items="items"
          v-model="selectedYear"
          label="Velg år"
          v-on:change="updateYear"
        ></v-select>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import moment from "moment";
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    items: ["2021", "2020"],
    count: 0,
    selectedYear: moment().year(),
  }),

  methods: {
    updateYear() {
      this.$store.dispatch("updateYear", this.selectedYear);
    },
  },
});
</script>

<style scoped>
.margin {
  margin-top: 25px;
  width: 100px;
}
</style>
