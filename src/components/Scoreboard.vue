<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="teams"
      class="elevation-1"
      hide-default-footer
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      show-expand
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">More info about {{ item.name }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => {
    return {
      headers: [
        {
          text: "Lag",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Poeng", value: "points" },
        { text: "", value: "data-table-expand" },
      ],
      teams: [
        { name: "King P1ns", points: 12 },
        { name: "Alvetaten", points: 10 },
        { name: "Alvictory", points: 5 },
        { name: "5 Percent", points: 8 },
      ],
      sortBy: "points",
      sortDesc: true,
      expanded: [],
      singleExpand: true,
    };
  },
  computed: {
    year(): number {
      return this.$store.state.selectedYear;
    },
  },
});
</script>

<style scoped></style>
