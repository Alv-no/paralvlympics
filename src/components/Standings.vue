<script setup lang="ts">
import PLTTabs from './ui/PLTTabs.vue'
import StandingsTable from './StandingsTable.vue'
import { useContestantsStore } from '@/stores/useContestantsStore'
import { useTeamsStore } from '@/stores/useTeamsStore'

import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

const selectedTab = ref<string>('Drivers')
const items = ['Drivers', 'Constructors']

const contestantsStore = useContestantsStore()
const { contestants } = storeToRefs(contestantsStore)

const teamsStore = useTeamsStore()
const { teams } = storeToRefs(teamsStore)

console.log(contestants.value)

const contestantRows = computed(() => {
  const rows = [...contestants.value]
  const sortedRows = rows
    .sort((c1, c2) => c2.totalPoints - c1.totalPoints)
    .map((c, index) => [index + 1, c.firstName + ' ' + c.lastName, c.team.name, c.totalPoints])

  return sortedRows
})

const teamRows = computed(() => {
  const rows = [...teams.value]
  return rows
    .sort((t1, t2) => t2.totalPoints - t1.totalPoints)
    .map((t, index) => [index + 1, t.name, t.totalPoints])
})
</script>

<template>

  <section id="standings" class="standings-wrapper">
     <PLTTabs :items="items" v-model:selected-tab="selectedTab" />
    <div v-if="selectedTab === 'Drivers'" class="standings-content">

      <h2 class="title-lg">Drivers Championship</h2>
       <StandingsTable :cols="['Plass', 'Fører', 'Lag', 'Poeng']" :rows="contestantRows" />
    </div>

    <div v-if="selectedTab === 'Constructors'" class="standings-content">

      <h2 class="title-lg">Constructors Championship</h2>
       <StandingsTable :cols="['Plass', 'Lag', 'Poeng']" :rows="teamRows" />
    </div>

  </section>

</template>

<style scoped lang="scss">
.standings-wrapper {
    margin-top: 96px;
    scroll-margin-top: 80px;
}

.standings-content {
    margin-top: 32px;
}
</style>

