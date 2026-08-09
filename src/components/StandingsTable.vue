<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  cols: string[]
  rows: (string | number)[][]
}>()

const itemsPerPage = 15
const currentPage = ref(1)
const isForward = ref(true)

const totalPages = computed(() => Math.ceil(props.rows.length / itemsPerPage))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return props.rows.slice(start, start + itemsPerPage)
})

const needsPagination = computed(() => props.rows.length > itemsPerPage)

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    isForward.value = true
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    isForward.value = false
    currentPage.value--
  }
}
</script>

<template>

  <div class="standings-table">

    <table>

      <thead>

        <tr>

          <th v-for="col in cols" :key="col">{{ col }}</th>

        </tr>

      </thead>
       <Transition :name="isForward ? 'fade-slide' : 'fade-slide-reverse'" mode="out-in"
        >
        <tbody :key="currentPage">

          <tr v-for="(row, rowIndex) in paginatedRows" :key="rowIndex">

            <td v-for="(col, colIndex) in cols" :key="colIndex">{{ row[colIndex] }}</td>

          </tr>

        </tbody>
         </Transition
      >
    </table>

    <div v-if="needsPagination" class="pagination">
       <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="pagination-button"
        aria-label="Previous page"
      >
        ←</button
      > <span class="pagination-info">Side {{ currentPage }} av {{ totalPages }}</span
      > <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pagination-button"
        aria-label="Next page"
      >
        →</button
      >
    </div>

  </div>

</template>

<style scoped lang="scss">
.standings-table {
  @extend .body-sm;
  margin-top: 24px;
  width: 100%;
  padding: 20px;
  background-color: $parchment-color-dark;
  @include carved-frame($stone-color, $gold-color);
}

table {
  width: 100%;
  border-collapse: collapse;
  position: relative;
}

th {
  @extend .label-xs;
  text-align: start;
  padding: 12px 0;
  color: $ink-color;
  border-bottom: 2px solid $ink-color;
}

// No first-column emphasis here: depending on the caller that cell is a rank,
// a driver name or a team name.
td {
  padding: 12px 0;
  border-bottom: 1px solid rgba($stone-color, 0.6);
}

tbody {
  position: relative;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease-in-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-slide-reverse-enter-active,
.fade-slide-reverse-leave-active {
  transition: all 0.4s ease-in-out;
}

.fade-slide-reverse-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-slide-reverse-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-reverse-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-reverse-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  margin-bottom: 16px;
}

.pagination-button {
  background-color: transparent;
  border: 1px solid $stone-color;
  border-radius: $radius-sm;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 16px;
  color: $ink-color;
  transition: all 0.2s ease;
  min-width: 40px;

  &:hover:not(:disabled) {
    background-color: $ink-color;
    border-color: $ink-color;
    color: $parchment-color;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.pagination-info {
  @extend .label-xs;
  color: $ink-color;
}
</style>
