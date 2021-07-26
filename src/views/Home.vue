<template>
  <div class="grid-container">
    <div class="grid-item">
      <b>Poeng for {{ year }}</b>
      <Scoreboard />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Scoreboard from "../components/Scoreboard.vue";

export default Vue.extend({
  name: "Home",

  computed: {
    year(): number {
      return this.$store.state.selectedYear;
    },
  },

  components: {
    Scoreboard,
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
  padding: 40px;
  font-size: 16px;
  text-align: center;
}
</style>
