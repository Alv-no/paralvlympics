import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Contestant } from '@/types/api-types'
import { useTeamsStore } from './useTeamsStore'
import { useResultsStore } from './useResultsStore'

const FIVE_MINUTES = 5 * 60 * 1000

interface ContestantRow {
  id: number
  first_name: string
  last_name: string
  career_wins: number
  seasons_competed: number
  image_url: string
  team_id: number
}

export const useContestantsStore = defineStore('contestants', () => {
  const contestants = ref<Contestant[]>([])
  const lastFetched = ref<number | null>(null)

  async function fetchContestants() {
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

    // Reuse results from useResultsStore
    const resultsStore = useResultsStore()
    if (resultsStore.contestantStats.size === 0) {
      await resultsStore.fetchResults()
    }

    const { data, error } = await supabase.from('contestants').select(`
        id,
        first_name,
        last_name,
        career_wins,
        seasons_competed,
        image_url,
        team_id
      `)

    if (error || !data) {
      console.error('Error fetching contestants:', error)
      return
    }

    // Transform to Contestant type and sort by total points (descending)
    contestants.value = data
      .map((contestant: ContestantRow) => {
        const stats = resultsStore.contestantStats.get(contestant.id) || {
          totalPoints: 0,
          totalPodiums: 0,
          totalFirstPlaces: 0,
        }

        const team = teamsMap.get(contestant.team_id)
        if (!team) {
          console.warn(`Team not found for contestant ${contestant.id} with team_id ${contestant.team_id}`)
        }

        return {
          id: contestant.id,
          firstName: contestant.first_name,
          lastName: contestant.last_name,
          careerWins: contestant.career_wins,
          seasonsCompeted: contestant.seasons_competed,
          imageUrl: contestant.image_url,
          team: team || {
            id: contestant.team_id,
            name: 'Unknown',
            description: null,
            color: '#000000',
            totalPoints: 0,
          },
          totalPoints: stats.totalPoints,
          totalPodiums: stats.totalPodiums,
          totalFirstPlaces: stats.totalFirstPlaces,
        }
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)

    lastFetched.value = now
  }

  return { contestants, fetchContestants }
})
