<script setup lang="ts">
defineProps<{
  cols: string[]
  rows: (string | number)[][]
}>()
</script>

<template>
    <div class="standings-table">
        <table>
            <thead>
                <tr>
                  <th v-for="col in cols" :key="col">{{ col }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in rows" :key="index">
                  <td v-for="(col, index) in cols" :key="index">{{ row[index] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped lang="scss">
.standings-table {
  @extend .title-xs;
  margin-top: 24px;
  width: 100%;
  padding: 20px;
  background-color: $gray-color-100;
  border-radius: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  @extend .label-md;
  text-align: start;
}

th {
  padding: 12px 0;
  border-bottom: 1px solid $black-color;
}

td {
  padding: 12px 0;
  border-bottom: 1px solid $gray-color-200;
}

</style>
