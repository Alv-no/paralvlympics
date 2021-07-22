<template>
  <Scoreboard />
</template>

<script lang="ts">
import Vue from "vue";
import Scoreboard from "../components/Scoreboard.vue";

export default Vue.extend({
  name: "Home",

  components: {
    Scoreboard,
  },
});
</script>
