<template>
  <div class="myclass">
    <h1 class="customheader">Dette er poengene for år {{ year }}:</h1>
    <ul>
      <li>Lag 1</li>
      <li>Lag 2</li>
      <li>Lag 3</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  computed: {
    year(): number {
      return this.$store.state.selectedYear;
    },
  },
});
</script>

<style scoped>
.myclass {
  margin-top: 50px;
}
.customheader {
  margin-left: 20px;
}
</style>
