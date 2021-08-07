<template>
  <div>
    <TeamCard
      title="King P1ns - 12p"
      subtitle="Jakob, Ida K. og Pål"
      expandText="King P1ns er best"
      imageName="King_P1ns.png"
    />
    <v-divider border-height="30px"></v-divider>
    <TeamCard
      title="PapeGøy1 - 10p"
      subtitle="Anders, Maiken, Tommy og Marcus"
      expandText="PapeGøy1 er ikke like gode"
      imageName="PapeGOY1.png"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamCard from "../components/TeamCard.vue";

export default Vue.extend({
  data: () => {
    return {
      show: false,
    };
  },
  computed: {
    year(): number {
      return this.$store.state.selectedYear;
    },
  },
  components: {
    TeamCard,
  },
});
</script>

<style scoped></style>
