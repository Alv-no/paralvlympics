<script setup lang="ts">
import PLTTabs from './ui/PLTTabs.vue'
import type { TabItem } from './ui/PLTTabs.vue'
import ContestantCard from './ContestantCard.vue'
import { useContestantsStore } from '@/stores/useContestantsStore'
import { useTeamsStore } from '@/stores/useTeamsStore'
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const selectedTeam = ref<string | null>(null)

const contestantsStore = useContestantsStore()
const { contestants } = storeToRefs(contestantsStore)

const teamsStore = useTeamsStore()
const { teams } = storeToRefs(teamsStore)

const teamNames = computed<TabItem[]>(() => {
  // Copy before sorting so we don't mutate the store's array. Teams come back
  // from Supabase unordered, so sort by id to keep the tabs as Lag 1 -> Lag 6.
  const teamItems = [...teams.value]
    .sort((a, b) => a.id - b.id)
    .map((team) => ({
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