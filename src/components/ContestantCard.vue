<script setup lang="ts">
import { computed } from 'vue'
import type { Contestant } from '@/types/api-types'
import dotMeshPng from '@/assets/images/contestant-card-dot-mesh.png'
import { teamLogos } from '@/assets/teamLogos'
import { Gauge, Wrench, Cpu, Dumbbell, Crown } from 'lucide-vue-next'

const roleConfig: Record<string, { icon: typeof Gauge; label: string }> = {
  'driver':          { icon: Gauge,    label: 'Driver' },
  'mechanic':        { icon: Wrench,   label: 'Mechanic' },
  'race engineer':   { icon: Cpu,      label: 'Race Engineer' },
  'pit muscle':      { icon: Dumbbell, label: 'Pit Muscle' },
  'team principal':  { icon: Crown,    label: 'Team Principal' },
}

const { contestant } = defineProps<{
  contestant: Contestant
}>()

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

const ratings = computed(() => [
  { label: 'Selvtillit',       value: contestant.ratingSelvtillit },
  { label: 'Logisk tenkning',  value: contestant.ratingLogiskTenkning },
  { label: 'Reaksjonsevne',    value: contestant.ratingReaksjonsevne },
  { label: 'Samarbeidsevne',   value: contestant.ratingSamarbeidsevne },
  { label: 'Kommunikasjon',    value: contestant.ratingKommunikasjon },
])

const role = computed(() => roleConfig[contestant.role?.toLowerCase()] ?? null)

const teamLogo = computed(() => teamLogos[contestant.team.name] ?? null)
</script>

<template>
  <div class="contestant-card" :style="{ background: backgroundGradient }">

    <div class="card-dot-mesh">
      <img :src="dotMeshPng" alt="" aria-hidden="true" />
    </div>

    <div class="card-image">
      <img :src="contestant.imageUrl" :alt="`${contestant.firstName} ${contestant.lastName}`" loading="lazy" />
    </div>

    <!-- Team logo badge (visible on default/non-hover state) -->
    <div v-if="teamLogo" class="team-logo-badge">
      <img :src="teamLogo" :alt="contestant.team.name" />
    </div>

    <div class="card-content">

      <div class="contestant-header">
        <div class="contestant-name">
          <h3 class="title-md">{{ contestant.firstName }} {{ contestant.lastName }}</h3>
          <p class="body-sm team-name" :style="{ color: contestant.team.color }">
            {{ contestant.team.name }}
          </p>
        </div>
        <!-- Logo also shown in content panel when hovered -->
        <img v-if="teamLogo" class="team-logo-content" :src="teamLogo" :alt="contestant.team.name" />
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
        <div class="stat-item">
          <p class="label-xs">Paralympics-deltagelser</p>
          <p class="title-sm">{{ contestant.paralympicsParticipations }}</p>
        </div>
        <div class="stat-item">
          <p class="label-xs">Seiere totalt</p>
          <p class="title-sm">{{ contestant.totalWins }}</p>
        </div>
      </div>

      <div v-if="role" class="role-badge" :style="{ backgroundColor: contestant.team.color }">
        <component :is="role.icon" :size="14" color="white" />
        <span>{{ role.label }}</span>
      </div>

      <div class="contestant-ratings">
        <div v-for="r in ratings" :key="r.label" class="rating-item">
          <p class="label-xs">{{ r.label }}</p>
          <div class="rating-pips">
            <span
              v-for="n in 5"
              :key="n"
              class="pip"
              :class="{ filled: n <= r.value }"
              :style="{ backgroundColor: n <= r.value ? contestant.team.color : undefined }"
            />
          </div>
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
    height: 440px;
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

// Badge visible on the card image (non-hovered)
.team-logo-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;

  img {
    width: 96px;
    height: 96px;
    object-fit: contain;
  }
}

// Hide badge when hovered (content panel takes over)
.contestant-card:hover .team-logo-badge {
  opacity: 0;
}

.card-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  padding: 16px 20px 44px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: $white-color;
  opacity: 0;
  transition: opacity 0.3s ease;
  overflow-y: auto;
  pointer-events: none;
}

.contestant-card:hover .card-content {
  pointer-events: auto;
}

.contestant-card:hover {
  .card-image { opacity: 0; }
  .card-content { opacity: 1; }
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

// Logo shown inside content panel header
.team-logo-content {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
}

.team-name {
  font-weight: 600;
}

.role-badge {
  position: absolute;
  bottom: 8px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  width: fit-content;

  span {
    font-size: 12px;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }
}

.contestant-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contestant-ratings {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding-top: 12px;
  margin-bottom: 0;
}

.rating-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .label-xs {
    flex: 1;
  }
}

.rating-pips {
  display: flex;
  gap: 4px;
}

.pip {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  opacity: 0.3;

  &.filled {
    opacity: 1;
    border-color: transparent;
  }
}
</style>