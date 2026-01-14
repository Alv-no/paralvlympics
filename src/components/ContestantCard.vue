<script setup lang="ts">
import type { Contestant } from '@/types/api-types'

const { contestant } = defineProps<{
  contestant: Contestant
}>()
</script>

<template>

  <div class="contestant-card">

    <div class="contestant-header">

      <div class="contestant-name">

        <h3 class="title-md">{{ contestant.firstName }} {{ contestant.lastName }}</h3>

        <p class="body-sm team-name" :style="{ color: contestant.team.color }">
           {{ contestant.team.name }}
        </p>

      </div>

    </div>

    <div class="contestant-stats">

      <div class="stat-item">

        <p class="label-xs">Poeng</p>

        <p class="title-sm">{{ contestant.totalPoints }}</p>

      </div>

      <div class="stat-item">

        <p class="label-xs">Pallplasser</p>

        <p class="title-sm">{{ contestant.totalPodiums }}</p>

      </div>

      <div class="stat-item">

        <p class="label-xs">Seiere</p>

        <p class="title-sm">{{ contestant.totalFirstPlaces }}</p>

      </div>

      <div class="stat-item">

        <p class="label-xs">Karriereseiere</p>

        <p class="title-sm">{{ contestant.careerWins }}</p>

      </div>

    </div>

  </div>

</template>

<style scoped lang="scss">
@use '@/assets/styles/_breakpoints.scss' as *;

.contestant-card {
  border: 1px solid $black-color;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: $white-color;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.contestant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.contestant-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.team-name {
  font-weight: 600;
}

.contestant-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>

