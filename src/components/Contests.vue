<template>
  <div class="myclass">
    <h1 class="customheader">Dette er konkurransene:</h1>
    <ul>
      <li>Konkurranse 1</li>
      <li>Konkurranse 2</li>
      <li>Konkurranse 3</li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>

<style scoped>
.myclass {
  margin-top: 50px;
}
.customheader {
  margin-left: 20px;
}
</style>
