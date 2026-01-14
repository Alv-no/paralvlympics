<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  cols: string[]
  rows: (string | number)[][]
}>()

const itemsPerPage = 15
const currentPage = ref(1)
const isForward = ref(true)

const totalPages = computed(() => {
  return Math.ceil(props.rows.length / itemsPerPage)
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.rows.slice(start, end)
})

const needsPagination = computed(() => {
  return props.rows.length > itemsPerPage
})

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

          <tr v-for="(row, index) in paginatedRows" :key="index">

            <td v-for="(col, index) in cols" :key="index">{{ row[index] }}</td>

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
         ← </button
      > <span class="pagination-info"> Side {{ currentPage }} av {{ totalPages }} </span> <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pagination-button"
        aria-label="Next page"
      >
         → </button
      >
    </div>

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
  position: relative;
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

tbody {
  position: relative;
}

// Fade slide transition animations
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

// Reverse fade slide transition animations (for going back)
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

// Pagination styles
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
  border: 1px solid $gray-color-200;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 16px;
  color: $black-color;
  transition: all 0.2s ease;
  min-width: 40px;

  &:hover:not(:disabled) {
    background-color: $gray-color-200;
    border-color: $black-color;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.pagination-info {
  @extend .label-md;
  color: $black-color;
}
</style>

