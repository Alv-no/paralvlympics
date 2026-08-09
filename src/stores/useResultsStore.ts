import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Tables } from '@/types/database.types'

const FIVE_MINUTES = 5 * 60 * 1000

type ContestantResultRow = Tables<'contestant_results'>
type TeamResultRow = Tables<'team_results'>

interface ContestantStats {
  totalPoints: number
  totalPodiums: number
  totalFirstPlaces: number
}

interface TeamStats {
  totalPoints: number
}

export const useResultsStore = defineStore('results', () => {
  const contestantResults = ref<ContestantResultRow[]>([])
  const teamResults = ref<TeamResultRow[]>([])
  const contestantStats = ref<Map<number, ContestantStats>>(new Map())
  const teamStats = ref<Map<number, TeamStats>>(new Map())
  const lastFetched = ref<number | null>(null)

  async function fetchResults() {
    const now = Date.now()
    if (lastFetched.value && now - lastFetched.value < FIVE_MINUTES) {
      return
    }

    // Fetch all contestant results
    const { data: contestantResultsData, error: contestantResultsError } = await supabase
      .from('contestant_results')
      .select('*')

    if (contestantResultsError) {
      console.error('Error fetching contestant results:', contestantResultsError)
      return
    }

    contestantResults.value = contestantResultsData || []

    // Fetch all team results
    const { data: teamResultsData, error: teamResultsError } = await supabase
      .from('team_results')
      .select('*')

    if (teamResultsError) {
      console.error('Error fetching team results:', teamResultsError)
      return
    }

    teamResults.value = teamResultsData || []

    // Calculate aggregated stats for contestants
    const contestantStatsMap = new Map<number, ContestantStats>()
    contestantResults.value.forEach((result: ContestantResultRow) => {
      const contestantId = result.contestant_id
      const current = contestantStatsMap.get(contestantId) || {
        totalPoints: 0,
        totalPodiums: 0,
        totalFirstPlaces: 0,
      }

      current.totalPoints += result.prize || 0
      if (result.placement <= 3) {
        current.totalPodiums += 1
      }
      if (result.placement === 1) {
        current.totalFirstPlaces += 1
      }

      contestantStatsMap.set(contestantId, current)
    })
    contestantStats.value = contestantStatsMap

    // Calculate aggregated stats for teams
    const teamStatsMap = new Map<number, TeamStats>()
    teamResults.value.forEach((result: TeamResultRow) => {
      const teamId = result.team_id
      const current = teamStatsMap.get(teamId) || {
        totalPoints: 0,
      }

      current.totalPoints += result.prize || 0

      teamStatsMap.set(teamId, current)
    })
    teamStats.value = teamStatsMap

    lastFetched.value = now
  }

  // Helper to get contestant results grouped by competition_id
  function getContestantResultsByCompetition(competitionId: number): ContestantResultRow[] {
    return contestantResults.value.filter((result) => result.competition_id === competitionId)
  }

  // Helper to get team results grouped by competition_id
  function getTeamResultsByCompetition(competitionId: number): TeamResultRow[] {
    return teamResults.value.filter((result) => result.competition_id === competitionId)
  }

  return {
    contestantResults,
    teamResults,
    contestantStats,
    teamStats,
    fetchResults,
    getContestantResultsByCompetition,
    getTeamResultsByCompetition,
  }
})
