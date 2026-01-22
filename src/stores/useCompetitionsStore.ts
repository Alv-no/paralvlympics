import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Competition } from '@/types/api-types'
import type { Tables } from '@/types/database.types'
import { useTeamsStore } from './useTeamsStore'
import { useContestantsStore } from './useContestantsStore'
import { useResultsStore } from './useResultsStore'

const FIVE_MINUTES = 5 * 60 * 1000

type CompetitionRow = Tables<'competitions'>
type ContestantResultRow = Tables<'contestant_results'>
type TeamResultRow = Tables<'team_results'>

export const useCompetitionsStore = defineStore('competitions', () => {
  const competitions = ref<Competition[]>([])
  const lastFetched = ref<number | null>(null)

  async function fetchCompetitions() {
    const now = Date.now()
    if (lastFetched.value && now - lastFetched.value < FIVE_MINUTES) {
      return
    }

    // Reuse teams from useTeamsStore
    const teamsStore = useTeamsStore()
    if (teamsStore.teams.length === 0) {
      await teamsStore.fetchTeams()
    }
    const teamsMap = new Map(teamsStore.teams.map(team => [team.id, team]))

    // Reuse contestants from useContestantsStore
    const contestantsStore = useContestantsStore()
    if (contestantsStore.contestants.length === 0) {
      await contestantsStore.fetchContestants()
    }
    const contestantsMap = new Map(contestantsStore.contestants.map(c => [c.id, c]))

    // Reuse results from useResultsStore
    const resultsStore = useResultsStore()
    if (resultsStore.contestantResults.length === 0 || resultsStore.teamResults.length === 0) {
      await resultsStore.fetchResults()
    }

    // Fetch competitions only (results are already fetched)
    const { data: competitionsData, error: competitionsError } = await supabase
      .from('competitions')
      .select('*')

    if (competitionsError || !competitionsData) {
      console.error('Error fetching competitions:', competitionsError)
      return
    }

    // Transform to Competition type and sort by id
    competitions.value = competitionsData
      .slice()
      .sort((a, b) => a.id - b.id)
      .map((comp: CompetitionRow) => {
        // Get results for this competition from results store
        const compContestantResults = resultsStore.getContestantResultsByCompetition(comp.id)
        const compTeamResults = resultsStore.getTeamResultsByCompetition(comp.id)

        const contestantResults = compContestantResults.map((cr: ContestantResultRow) => {
          const contestant = contestantsMap.get(cr.contestant_id)
          if (!contestant) {
            console.warn(`Contestant not found for contestant_result ${cr.id} with contestant_id ${cr.contestant_id}`)
            return null
          }
          return {
            id: cr.id.toString(),
            placement: cr.placement,
            prize: cr.prize,
            contestant: {
              id: contestant.id,
              firstName: contestant.firstName,
              lastName: contestant.lastName,
              careerWins: contestant.careerWins,
              seasonsCompeted: contestant.seasonsCompeted,
              imageUrl: contestant.imageUrl,
              team: contestant.team,
              totalPoints: contestant.totalPoints,
              totalPodiums: contestant.totalPodiums,
              totalFirstPlaces: contestant.totalFirstPlaces,
            },
          }
        }).filter((result): result is NonNullable<typeof result> => result !== null)

        const teamResults = compTeamResults.map((tr: TeamResultRow) => {
          const team = teamsMap.get(tr.team_id)
          if (!team) {
            console.warn(`Team not found for team_result ${tr.id} with team_id ${tr.team_id}`)
            return null
          }
          return {
            id: tr.id.toString(),
            placement: tr.placement,
            prize: tr.prize,
            team: {
              id: team.id,
              name: team.name,
              description: team.description,
              color: team.color,
              totalPoints: team.totalPoints,
            },
          }
        }).filter((result): result is NonNullable<typeof result> => result !== null)

        return {
          id: comp.id,
          name: comp.name,
          description: comp.description,
          date: comp.date,
          isNext: comp.is_next,
          isFinished: comp.is_finished,
          imageUrl: comp.image_url,
          contestantsResults: contestantResults,
          teamResults,
        }
      })

    lastFetched.value = now
  }

  return { competitions, fetchCompetitions }
})
