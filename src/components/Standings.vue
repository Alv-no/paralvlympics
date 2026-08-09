<script setup lang="ts">
import PLTTabs from './ui/PLTTabs.vue'
import StandingsTable from './StandingsTable.vue'
import { useContestantsStore } from '@/stores/useContestantsStore'
import { useTeamsStore } from '@/stores/useTeamsStore'
import { useCurrentCompetitionStore } from '@/stores/useCurrentCompetitionStore'
import { useCompetitionsStore } from '@/stores/useCompetitionsStore'
import { useResultsStore } from '@/stores/useResultsStore'
import { User, Trophy } from 'lucide-vue-next'
import { computed, ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

type TabItem = {
  id: string
  label: string
}

const selectedTopTab = ref<string>('Drivers')
const selectedDriversTab = ref<string>('Konkurranse')
const selectedConstructorsTab = ref<string>('Sammenlagt')

const driversTabs = computed<TabItem[]>(() => [
  { id: 'Konkurranse', label: 'Konkurranse' },
  { id: 'Sammenlagt', label: 'Sammenlagt' },
  { id: 'Oversikt', label: 'Oversikt' },
])

const constructorsTabs = computed<TabItem[]>(() => [
  { id: 'Sammenlagt', label: 'Sammenlagt' },
  { id: 'Per konkurranse', label: 'Per konkurranse' },
])

const contestantsStore = useContestantsStore()
const { contestants } = storeToRefs(contestantsStore)

const teamsStore = useTeamsStore()
const { teams } = storeToRefs(teamsStore)

const competitionsStore = useCompetitionsStore()
const { competitions } = storeToRefs(competitionsStore)

const resultsStore = useResultsStore()
const { teamResults } = storeToRefs(resultsStore)

const currentCompetitionStore = useCurrentCompetitionStore()

const currentCompetition = computed(() => {
  const list = competitions.value ?? []
  return list.find((c: any) => c.isNext || !c.isFinished) ?? list[list.length - 1]
})

onMounted(async () => {
  await Promise.all([
    competitionsStore.fetchCompetitions(),
    contestantsStore.fetchContestants(),
    resultsStore.fetchResults(),
  ])
  if (currentCompetition.value) {
    await currentCompetitionStore.fetchDataForCompetition(currentCompetition.value.id)
  }
})

watch(currentCompetition, async (comp) => {
  if (!comp) return
  await currentCompetitionStore.fetchDataForCompetition(comp.id)
})

const currentCompetitionResults = computed(() => {
  if (!currentCompetition.value) return []
  return currentCompetitionStore.getResultsForCompetition(
    currentCompetition.value.id,
    contestants.value,
  )
})

const podium = computed(() => currentCompetitionResults.value.slice(0, 3))
const rest = computed(() => currentCompetitionResults.value.slice(3))

const sortedContestants = computed(() =>
  [...contestants.value].sort((a, b) => b.totalPoints - a.totalPoints),
)

const contestantRows = computed(() =>
  sortedContestants.value.map((c, i) => [
    i + 1,
    c.firstName + ' ' + c.lastName,
    c.team.name,
    c.totalPoints,
  ]),
)

const teamRows = computed(() =>
  [...teams.value]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((t, i) => [i + 1, t.name, t.totalPoints]),
)

const { contestantResults } = storeToRefs(resultsStore)

const driverPerCompetitionCols = computed(() => [
  'Fører',
  'Lag',
  ...finishedCompetitions.value.map((c: any) => c.name),
  'Totalt',
])

const driverPerCompetitionRows = computed(() =>
  sortedContestants.value.map((c) => {
    const pointsPerComp = finishedCompetitions.value.map((comp: any) => {
      const result = contestantResults.value.find(
        (r) => r.contestant_id === c.id && r.competition_id === comp.id,
      )
      return result?.prize ?? '—'
    })
    return [c.firstName + ' ' + c.lastName, c.team.name, ...pointsPerComp, c.totalPoints]
  }),
)

const finishedCompetitions = computed(() =>
  (competitions.value ?? []).filter((c: any) => c.isFinished),
)

const teamPerCompetitionCols = computed(() => [
  'Lag',
  ...finishedCompetitions.value.map((c: any) => c.name),
  'Totalt',
])

const teamPerCompetitionRows = computed(() => {
  const sorted = [...teams.value].sort((a, b) => b.totalPoints - a.totalPoints)
  return sorted.map((team) => {
    const pointsPerComp = finishedCompetitions.value.map((comp: any) => {
      const result = teamResults.value.find(
        (r) => r.team_id === team.id && r.competition_id === comp.id,
      )
      return result?.prize ?? '—'
    })
    return [team.name, ...pointsPerComp, team.totalPoints]
  })
})
</script>

<template>

  <section id="standings" class="standings-wrapper">

    <h2 class="title-lg" style="margin-bottom: 32px">Live Ranking</h2>

    <div class="standings-layout">
       <!-- Sidebar -->
      <div class="standings-sidebar">
         <button
          class="sidebar-card"
          :class="{ 'sidebar-card--active': selectedTopTab === 'Individuell' }"
          @click="selectedTopTab = 'Drivers'"
        >
           <User :size="36" /> <span>Drivers</span> </button
        > <button
          class="sidebar-card"
          :class="{ 'sidebar-card--active': selectedTopTab === 'Lag' }"
          @click="selectedTopTab = 'Constructors'"
        >
           <Trophy :size="36" /> <span>Constructors</span> </button
        >
      </div>
       <!-- Main content -->
      <div class="standings-main">
         <!-- ── DRIVERS ── -->
        <div v-if="selectedTopTab === 'Drivers'">
           <PLTTabs
            :items="driversTabs"
            v-model:selected-tab="selectedDriversTab"
            class="sub-tabs"
          /> <!-- Konkurranse -->
          <div v-if="selectedDriversTab === 'Konkurranse'" class="tab-content">

            <h2 class="title-lg">{{ currentCompetition?.name ?? 'Konkurranse' }}</h2>

            <p v-if="currentCompetitionResults.length === 0" class="no-results">
               Ingen resultater registrert ennå.
            </p>
             <template v-else
              >
              <div class="podium">
                 <!-- 2nd -->
                <div
                  v-if="podium[1]"
                  class="podium-card podium-card--second"
                  :style="{ backgroundColor: podium[1].contestant.team.color }"
                >

                  <div class="podium-card__weave" />

                  <div class="podium-card__body">
                     <span class="podium-card__pos">2</span> <span class="podium-card__name"
                      >{{ podium[1].contestant.firstName }} {{
                        podium[1].contestant.lastName
                      }}</span
                    > <span class="podium-card__result">{{
                      podium[1].bestResult != null
                        ? `${podium[1].bestResult}${podium[1].metric ?? ''}`
                        : ''
                    }}</span
                    > <span class="podium-card__points">{{ podium[1].points }} pts</span>
                  </div>
                   <img
                    class="podium-card__img"
                    :src="podium[1].contestant.imageUrl"
                    :alt="podium[1].contestant.firstName"
                  />
                </div>
                 <!-- 1st -->
                <div
                  v-if="podium[0]"
                  class="podium-card podium-card--first"
                  :style="{ backgroundColor: podium[0].contestant.team.color }"
                >

                  <div class="podium-card__weave" />

                  <div class="podium-card__body">
                     <span class="podium-card__pos">1</span> <span class="podium-card__name"
                      >{{ podium[0].contestant.firstName }} {{
                        podium[0].contestant.lastName
                      }}</span
                    > <span class="podium-card__result">{{
                      podium[0].bestResult != null
                        ? `${podium[0].bestResult}${podium[0].metric ?? ''}`
                        : ''
                    }}</span
                    > <span class="podium-card__points">{{ podium[0].points }} pts</span>
                  </div>
                   <img
                    class="podium-card__img"
                    :src="podium[0].contestant.imageUrl"
                    :alt="podium[0].contestant.firstName"
                  />
                </div>
                 <!-- 3rd -->
                <div
                  v-if="podium[2]"
                  class="podium-card podium-card--third"
                  :style="{ backgroundColor: podium[2].contestant.team.color }"
                >

                  <div class="podium-card__weave" />

                  <div class="podium-card__body">
                     <span class="podium-card__pos">3</span> <span class="podium-card__name"
                      >{{ podium[2].contestant.firstName }} {{
                        podium[2].contestant.lastName
                      }}</span
                    > <span class="podium-card__result">{{
                      podium[2].bestResult != null
                        ? `${podium[2].bestResult}${podium[2].metric ?? ''}`
                        : ''
                    }}</span
                    > <span class="podium-card__points">{{ podium[2].points }} pts</span>
                  </div>
                   <img
                    class="podium-card__img"
                    :src="podium[2].contestant.imageUrl"
                    :alt="podium[2].contestant.firstName"
                  />
                </div>

              </div>
               <!-- Positions 4+ -->
              <div class="standings-table-wrapper">

                <table class="standings-table">

                  <thead>

                    <tr>

                      <th>Pos.</th>

                      <th>Fører</th>

                      <th>Lag</th>

                      <th>Resultat</th>

                      <th>Poeng</th>

                    </tr>

                  </thead>

                  <tbody>

                    <tr v-for="r in rest" :key="r.contestant.id">

                      <td>{{ r.placement }}</td>

                      <td>

                        <div class="driver-cell">
                           <img
                            class="driver-cell__avatar"
                            :src="r.contestant.imageUrl"
                            :alt="r.contestant.firstName"
                          /> <span class="driver-cell__name"
                            >{{ r.contestant.firstName }} {{ r.contestant.lastName }}</span
                          >
                        </div>

                      </td>

                      <td>{{ r.contestant.team.name }}</td>

                      <td>{{ r.bestResult != null ? `${r.bestResult}${r.metric ?? ''}` : '' }}</td>

                      <td>{{ r.points }}</td>

                    </tr>

                  </tbody>

                </table>

              </div>
               </template
            >
          </div>
           <!-- Sammenlagt -->
          <div v-if="selectedDriversTab === 'Sammenlagt'" class="tab-content">

            <h2 class="title-lg">Drivers Championship</h2>
             <StandingsTable :cols="['Plass', 'Fører', 'Lag', 'Poeng']" :rows="contestantRows" />
          </div>
           <!-- Oversikt -->
          <div v-if="selectedDriversTab === 'Oversikt'" class="tab-content">

            <h2 class="title-lg">Poeng per konkurranse</h2>

            <p v-if="finishedCompetitions.length === 0" class="no-results">
               Ingen fullførte konkurranser ennå.
            </p>
             <StandingsTable
              v-else
              :cols="driverPerCompetitionCols"
              :rows="driverPerCompetitionRows"
            />
          </div>

        </div>
         <!-- ── CONSTRUCTORS ── -->
        <div v-if="selectedTopTab === 'Constructors'">
           <PLTTabs
            :items="constructorsTabs"
            v-model:selected-tab="selectedConstructorsTab"
            class="sub-tabs"
          /> <!-- Sammenlagt -->
          <div v-if="selectedConstructorsTab === 'Sammenlagt'" class="tab-content">

            <h2 class="title-lg">Constructors Championship</h2>
             <StandingsTable :cols="['Plass', 'Lag', 'Poeng']" :rows="teamRows" />
          </div>
           <!-- Per konkurranse -->
          <div v-if="selectedConstructorsTab === 'Per konkurranse'" class="tab-content">

            <h2 class="title-lg">Poeng per konkurranse</h2>

            <p v-if="finishedCompetitions.length === 0" class="no-results">
               Ingen fullførte konkurranser ennå.
            </p>
             <StandingsTable v-else :cols="teamPerCompetitionCols" :rows="teamPerCompetitionRows" />

          </div>

        </div>

      </div>
       <!-- end standings-main -->
    </div>
     <!-- end standings-layout -->
  </section>

</template>

<style scoped lang="scss">
.standings-wrapper {
  margin-top: 96px;
  scroll-margin-top: 80px;
}

.standings-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.standings-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  width: 140px;
}

.sidebar-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 16px;
  border: 1px solid $stone-color;
  border-radius: $radius-lg;
  background: $parchment-color;
  color: $ink-color;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;

  span {
    @extend .label-xs;
    color: $ink-color;
  }

  &--active {
    @include carved-frame($rust-color, $gold-color-light);
    background: rgba($rust-color, 0.08);
    color: $rust-color-dark;
  }

  &:hover:not(&--active) {
    border-color: $ink-color;
    background: $parchment-color-dark;
  }
}

.standings-main {
  flex: 1;
  min-width: 0;
}

.sub-tabs {
  margin-bottom: 32px;
}

.tab-content {
  margin-top: 32px;
}

.no-results {
  color: rgba($ink-color, 0.55);
  font-style: italic;
  margin-top: 24px;
}

// Podium
.podium {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 32px;
}

.podium-card {
  flex: 1;
  border: 1px solid $ink-color;
  border-radius: $radius-lg;
  overflow: hidden;
  position: relative;
  min-height: 180px;
  display: flex;
  align-items: flex-end;

  &--first {
    min-height: 240px;
    order: 2;
    // The winner gets the gilt frame.
    box-shadow: inset 0 0 0 2px rgba($gold-color-light, 0.75);
  }
  &--second { min-height: 200px; order: 1; }
  &--third  { min-height: 200px; order: 3; }
}

.podium-card__weave {
  position: absolute;
  inset: 0;
  @include woven-texture(rgba(255, 255, 255, 0.14));
  pointer-events: none;
}

.podium-card__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 16px;
  flex: 1;
}

.podium-card__img {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 55%;
  object-fit: cover;
  object-position: top;
  mask-image: linear-gradient(to left, black 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to left, black 60%, transparent 100%);
}

.podium-card__pos {
  @extend .title-xl;
  color: $gold-color-light;
  line-height: 1;
}
.podium-card__name {
  @extend .title-sm;
  color: $parchment-color;
  max-width: 55%;
  line-height: 1.3;
}
.podium-card__result { @extend .body-xs; color: rgba($parchment-color, 0.85); margin-top: 2px; }
.podium-card__points { @extend .label-xs; color: rgba($parchment-color, 0.7); }

// Table
.standings-table-wrapper {
  background-color: $parchment-color-dark;
  @include carved-frame($stone-color, $gold-color);
  padding: 20px;
}

.standings-table {
  width: 100%;
  border-collapse: collapse;

  th {
    @extend .label-xs;
    text-align: start;
    padding: 12px 0;
    color: $ink-color;
    border-bottom: 2px solid $ink-color;
  }

  td {
    @extend .body-sm;
    padding: 12px 0;
    border-bottom: 1px solid rgba($stone-color, 0.6);
  }

  td:first-child {
    @extend .title-sm;
    width: 60px;
    color: $rust-color-dark;
  }
}

.driver-cell {
  display: flex;
  align-items: center;
  gap: 10px;

  &__avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid rgba($gold-color, 0.7);
    object-fit: cover;
    object-position: top;
  }

  &__name { font-weight: 600; }
}
</style>
