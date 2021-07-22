<template>
  <div class="myclass">
    <h1 class="customheader">This is the score:</h1>
    <li>
      <ul>
        Team 1
      </ul>
      <ul>
        Team 2
      </ul>
      <ul>
        Team 3
      </ul>
    </li>
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
