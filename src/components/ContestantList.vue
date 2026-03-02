<script setup lang="ts">
import PLTTabs from './ui/PLTTabs.vue'
import type { TabItem } from './ui/PLTTabs.vue'
import ContestantCard from './ContestantCard.vue'
import { useContestantsStore } from '@/stores/useContestantsStore'
import { useTeamsStore } from '@/stores/useTeamsStore'
import { teamLogos } from '@/assets/teamLogos'
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const selectedTeamData = computed(() =>
  teams.value.find((t) => t.name === selectedTeam.value) ?? null
)

const selectedTeam = ref<string | null>(null)

const contestantsStore = useContestantsStore()
const { contestants } = storeToRefs(contestantsStore)

const teamsStore = useTeamsStore()
const { teams } = storeToRefs(teamsStore)

const teamNames = computed<TabItem[]>(() => {
  const teamItems = teams.value.map((team) => ({
    label: team.name,
  }))
  return [{ label: 'Alle' }, ...teamItems]
})

const filteredContestants = computed(() => {
  if (!selectedTeam.value || selectedTeam.value === 'Alle') {
    return contestants.value
  }
  return contestants.value.filter((contestant) => contestant.team.name === selectedTeam.value)
})

onMounted(() => {
  contestantsStore.fetchContestants()
  teamsStore.fetchTeams()
  if (teamNames.value.length > 0) {
    selectedTeam.value = 'Alle'
  }
})
</script>

<template>
  <section id="contestants" class="driver-list-wrapper">

    <h2 class="title-lg">Førere</h2>

    <div class="tabs-container" v-if="teamNames.length > 1">
      <PLTTabs :items="teamNames" v-model:selected-tab="selectedTeam" />
    </div>

    <Transition name="banner">
      <div
        v-if="selectedTeamData"
        class="team-banner"
        :style="{ backgroundColor: selectedTeamData.color }"
      >
        <img
          v-if="teamLogos[selectedTeamData.name]"
          :src="teamLogos[selectedTeamData.name]"
          :alt="selectedTeamData.name"
          class="team-banner-logo"
        />
      </div>
    </Transition>

    <div class="contestants-grid">
      <ContestantCard
        v-for="contestant in filteredContestants"
        :key="contestant.id"
        :contestant="contestant"
      />
    </div>

  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_breakpoints.scss' as *;

.driver-list-wrapper {
  margin-top: 96px;
  scroll-margin-top: 80px;
}

.tabs-container {
  margin-top: 32px;
}

.team-banner {
  margin-top: 24px;
  border-radius: 16px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.team-banner-logo {
  height: 110px;
  width: auto;
  object-fit: contain;
}

.banner-enter-active,
.banner-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.banner-enter-from,
.banner-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.contestants-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 32px;

  > * {
    flex: 1 1 100%;
    min-width: 0;

    @include lg {
      flex: 0 1 calc((100% - 24px) / 2);
    }
  }
}
</style>