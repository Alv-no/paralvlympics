<script setup lang="ts">
import PLTTabs from './ui/PLTTabs.vue'
import StandingsTable from './StandingsTable.vue'
import { useContestantsStore } from '@/stores/useContestantsStore'
import { useTeamsStore } from '@/stores/useTeamsStore'
import { useCurrentCompetitionStore } from '@/stores/useCurrentCompetitionStore'
import { useCompetitionsStore } from '@/stores/useCompetitionsStore'
import { useResultsStore } from '@/stores/useResultsStore'
import { Gauge, Wrench, Cpu, Dumbbell, Crown, User, Trophy } from 'lucide-vue-next'
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

const roleConfig: Record<string, { icon: typeof Gauge; label: string }> = {
  driver: { icon: Gauge, label: 'Driver' },
  mechanic: { icon: Wrench, label: 'Mechanic' },
  'race engineer': { icon: Cpu, label: 'Race Engineer' },
  'pit muscle': { icon: Dumbbell, label: 'Pit Muscle' },
  'team principal': { icon: Crown, label: 'Team Principal' },
}

const getRole = (role: string | null) => (role ? roleConfig[role.toLowerCase()] ?? null : null)

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
  return currentCompetitionStore.getResultsForCompetition(currentCompetition.value.id, contestants.value)
})

const podium = computed(() => currentCompetitionResults.value.slice(0, 3))
const rest = computed(() => currentCompetitionResults.value.slice(3))

const sortedContestants = computed(() =>
  [...contestants.value].sort((a, b) => b.totalPoints - a.totalPoints)
)

const contestantRows = computed(() =>
  sortedContestants.value.map((c, i) => [i + 1, c.firstName + ' ' + c.lastName, c.team.name, c.totalPoints]),
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
        (r) => r.contestant_id === c.id && r.competition_id === comp.id
      )
      return result?.prize ?? '—'
    })
    return [c.firstName + ' ' + c.lastName, c.team.name, ...pointsPerComp, c.totalPoints]
  })
)

const finishedCompetitions = computed(() =>
  (competitions.value ?? []).filter((c: any) => c.isFinished)
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
        (r) => r.team_id === team.id && r.competition_id === comp.id
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
          :class="{ 'sidebar-card--active': selectedTopTab === 'Drivers' }"
          @click="selectedTopTab = 'Drivers'"
        >
          <User :size="36" />
          <span>Drivers</span>
        </button>
        <button
          class="sidebar-card"
          :class="{ 'sidebar-card--active': selectedTopTab === 'Constructors' }"
          @click="selectedTopTab = 'Constructors'"
        >
          <Trophy :size="36" />
          <span>Constructors</span>
        </button>
      </div>

      <!-- Main content -->
      <div class="standings-main">

        <!-- ── DRIVERS ── -->
        <div v-if="selectedTopTab === 'Drivers'">
          <PLTTabs :items="driversTabs" v-model:selected-tab="selectedDriversTab" class="sub-tabs" />

          <!-- Konkurranse -->
          <div v-if="selectedDriversTab === 'Konkurranse'" class="tab-content">
            <h2 class="title-lg">{{ currentCompetition?.name ?? 'Konkurranse' }}</h2>

            <p v-if="currentCompetitionResults.length === 0" class="no-results">
              Ingen resultater registrert ennå.
            </p>

            <template v-else>
              <div class="podium">
                <!-- 2nd -->
                <div
                  v-if="podium[1]"
                  class="podium-card podium-card--second"
                  :style="{ backgroundColor: podium[1].contestant.team.color }"
                >
                  <div class="podium-card__dots" />
                  <div class="podium-card__body">
                    <span class="podium-card__pos">2</span>
                    <span class="podium-card__name">{{ podium[1].contestant.firstName }} {{ podium[1].contestant.lastName }}</span>
                    <span class="podium-card__result">{{ podium[1].bestResult != null ? `${podium[1].bestResult}${podium[1].metric ?? ''}` : '' }}</span>
                    <span class="podium-card__points">{{ podium[1].points }} pts</span>
                    <div v-if="getRole(podium[1].contestant.role)" class="podium-card__role">
                      <component :is="getRole(podium[1].contestant.role)!.icon" :size="12" color="white" />
                      <span>{{ getRole(podium[1].contestant.role)!.label }}</span>
                    </div>
                  </div>
                  <img class="podium-card__img" :src="podium[1].contestant.imageUrl" :alt="podium[1].contestant.firstName" />
                </div>

                <!-- 1st -->
                <div
                  v-if="podium[0]"
                  class="podium-card podium-card--first"
                  :style="{ backgroundColor: podium[0].contestant.team.color }"
                >
                  <div class="podium-card__dots" />
                  <div class="podium-card__body">
                    <span class="podium-card__pos">1</span>
                    <span class="podium-card__name">{{ podium[0].contestant.firstName }} {{ podium[0].contestant.lastName }}</span>
                    <span class="podium-card__result">{{ podium[0].bestResult != null ? `${podium[0].bestResult}${podium[0].metric ?? ''}` : '' }}</span>
                    <span class="podium-card__points">{{ podium[0].points }} pts</span>
                    <div v-if="getRole(podium[0].contestant.role)" class="podium-card__role">
                      <component :is="getRole(podium[0].contestant.role)!.icon" :size="12" color="white" />
                      <span>{{ getRole(podium[0].contestant.role)!.label }}</span>
                    </div>
                  </div>
                  <img class="podium-card__img" :src="podium[0].contestant.imageUrl" :alt="podium[0].contestant.firstName" />
                </div>

                <!-- 3rd -->
                <div
                  v-if="podium[2]"
                  class="podium-card podium-card--third"
                  :style="{ backgroundColor: podium[2].contestant.team.color }"
                >
                  <div class="podium-card__dots" />
                  <div class="podium-card__body">
                    <span class="podium-card__pos">3</span>
                    <span class="podium-card__name">{{ podium[2].contestant.firstName }} {{ podium[2].contestant.lastName }}</span>
                    <span class="podium-card__result">{{ podium[2].bestResult != null ? `${podium[2].bestResult}${podium[2].metric ?? ''}` : '' }}</span>
                    <span class="podium-card__points">{{ podium[2].points }} pts</span>
                    <div v-if="getRole(podium[2].contestant.role)" class="podium-card__role">
                      <component :is="getRole(podium[2].contestant.role)!.icon" :size="12" color="white" />
                      <span>{{ getRole(podium[2].contestant.role)!.label }}</span>
                    </div>
                  </div>
                  <img class="podium-card__img" :src="podium[2].contestant.imageUrl" :alt="podium[2].contestant.firstName" />
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
                        <img class="driver-cell__avatar" :src="r.contestant.imageUrl" :alt="r.contestant.firstName" />
                        <span class="driver-cell__name">{{ r.contestant.firstName }} {{ r.contestant.lastName }}</span>
                        <div
                          v-if="getRole(r.contestant.role)"
                          class="driver-cell__role"
                          :style="{ backgroundColor: r.contestant.team.color }"
                        >
                          <component :is="getRole(r.contestant.role)!.icon" :size="11" color="white" />
                          <span>{{ getRole(r.contestant.role)!.label }}</span>
                        </div>
                      </div>
                    </td>
                    <td>{{ r.contestant.team.name }}</td>
                    <td>{{ r.bestResult != null ? `${r.bestResult}${r.metric ?? ''}` : '' }}</td>
                    <td>{{ r.points }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </template>
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
          <PLTTabs :items="constructorsTabs" v-model:selected-tab="selectedConstructorsTab" class="sub-tabs" />

          <!-- Sammenlagt -->
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
            <StandingsTable
              v-else
              :cols="teamPerCompetitionCols"
              :rows="teamPerCompetitionRows"
            />
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
  border-radius: 16px;
  border: 2px solid $gray-color-200;
  background: white;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;

  span {
    font-size: 14px;
    font-weight: 700;
    color: $black-color;
  }

  &--active {
    border-color: $red-color-300;
    background: rgba($red-color-300, 0.05);
  }

  &:hover:not(&--active) {
    border-color: $gray-color-200;
    background: $gray-color-100;
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
  color: rgba(0, 0, 0, 0.4);
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
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  min-height: 180px;
  display: flex;
  align-items: flex-end;

  &--first  { min-height: 240px; order: 2; }
  &--second { min-height: 200px; order: 1; }
  &--third  { min-height: 200px; order: 3; }
}

.podium-card__dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 14px 14px;
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

.podium-card__pos    { font-size: 40px; font-weight: 800; color: white; line-height: 1; }
.podium-card__name   { font-size: 15px; font-weight: 700; color: white; max-width: 55%; line-height: 1.3; }
.podium-card__result { font-size: 12px; color: rgba(255, 255, 255, 0.8); margin-top: 2px; }
.podium-card__points { font-size: 12px; color: rgba(255, 255, 255, 0.6); font-weight: 600; }

.podium-card__role {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2px 8px;
  width: fit-content;

  span { font-size: 11px; color: white; font-weight: 600; text-transform: capitalize; }
}

// Table
.standings-table-wrapper {
  background-color: $gray-color-100;
  border-radius: 12px;
  padding: 20px;
}

.standings-table {
  width: 100%;
  border-collapse: collapse;

  th {
    @extend .label-md;
    text-align: start;
    padding: 12px 0;
    border-bottom: 1px solid $black-color;
  }

  td {
    padding: 12px 0;
    border-bottom: 1px solid $gray-color-200;
    font-size: 14px;
  }

  td:first-child {
    width: 60px;
    font-weight: 700;
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
    object-fit: cover;
    object-position: top;
  }

  &__name { font-weight: 600; }

  &__role {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 20px;

    span { font-size: 11px; color: white; font-weight: 600; text-transform: capitalize; }
  }
}
</style>
