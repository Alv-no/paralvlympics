<template>
  <div class="grid-container">
    <div class="grid-item">
      <Scoreboard :year="2020" class="grid-item" />
    </div>
    <div class="grid-item">
      <Contests class="grid-item" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Scoreboard from "../components/Scoreboard.vue";
import Contests from "../components/Contests.vue";

export default Vue.extend({
  name: "Home",

  components: {
    Scoreboard,
    Contests,
  },
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 10px;
}
.grid-item {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  font-size: 16px;
  text-align: center;
}
</style>
