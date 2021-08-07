<template>
  <div class="grid-container">
    <div class="grid-item">
      <b>Poeng for {{ year }}</b>
      <hr class="solid" />
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
  justify-content: center;
}
.grid-item {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 40px;
  font-size: 26px;
  text-align: center;
}
/* Solid border */
hr.solid {
  border-top: 3px solid rgb(10, 10, 10);
  margin-bottom: 15px;
}
</style>
