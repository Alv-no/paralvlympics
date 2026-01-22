<script setup lang="ts">
import { computed } from 'vue'
import type { Contestant } from '@/types/api-types'
import dotMeshPng from '@/assets/images/contestant-card-dot-mesh.png'

const { contestant } = defineProps<{
  contestant: Contestant
}>()

// Function to lighten a hex color by mixing with white
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round((255 - ((num >> 16) & 0xff)) * percent / 100))
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round((255 - ((num >> 8) & 0xff)) * percent / 100))
  const b = Math.min(255, (num & 0xff) + Math.round((255 - (num & 0xff)) * percent / 100))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

const backgroundGradient = computed(() => {
  const baseColor = contestant.team.color
  const lighterColor = lightenColor(baseColor, 20)
  return `linear-gradient(to right, ${baseColor}, ${lighterColor})`
})
</script>

<template>

  <div class="contestant-card" :style="{ background: backgroundGradient }">

    <div class="card-dot-mesh">
      <img :src="dotMeshPng" alt="" aria-hidden="true" />
    </div>

    <div class="card-image">
      <img :src="contestant.imageUrl" :alt="`${contestant.firstName} ${contestant.lastName}`" loading="lazy" />
    </div>

    <div class="card-content">

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

  </div>

</template>

<style scoped lang="scss">
@use '@/assets/styles/_breakpoints.scss' as *;

.contestant-card {
  border: 1px solid $black-color;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  height: 250px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.card-dot-mesh {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
}

.card-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: $white-color;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.contestant-card:hover {
  .card-image {
    opacity: 0;
  }

  .card-content {
    opacity: 1;
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

