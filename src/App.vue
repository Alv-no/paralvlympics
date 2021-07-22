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
          width="120"
        />
      </div>

      <v-spacer></v-spacer>
      <div class="margin">
        <v-select :items="items" style="width: 80px" label="Velg år"></v-select>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    items: ["2021", "2020"],
  }),
});
</script>

<style scoped>
.margin {
  margin-top: 25px;
}
</style>
