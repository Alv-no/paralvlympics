<script setup lang="ts">
  import CompetitionCard from '@/components/CompetitionCard.vue'
  import { useCompetitionsStore } from '@/stores/useCompetitionsStore'
  import { storeToRefs } from 'pinia'

  const competitionsStore = useCompetitionsStore()
  const { competitions } = storeToRefs(competitionsStore)


</script>

<template>
    <section id="schedule" class="schedule-wrapper">
      <h2 class="title-lg">Program</h2>
      <div class="competition-wrapper">
        <CompetitionCard v-for="competition, index in competitions" :key="competition.id" :competition="competition" :index="index" />
      </div>
</section>
</template>


<style scoped lang="scss">
  .schedule-wrapper {
    margin-top: 96px;
  }

  #schedule {
    scroll-margin-top: 80px;
  }
  .competition-wrapper {
    justify-content: center;
    margin-top: 32px;
    display: flex;
    flex-wrap: wrap;
    gap: 32px;

  }
</style>
