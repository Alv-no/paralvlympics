import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Contestant } from '@/types/api-types'

const FIVE_MINUTES = 5 * 60 * 1000

interface ContestantRow {
  id: number
  first_name: string
  last_name: string
  career_wins: number
  seasons_competed: number
  teams: {
    id: number
    name: string
    description: string | null
    color: string
  }
}

interface ContestantResultRow {
  contestant_id: number
  placement: number
  prize: number
}

export const useContestantsStore = defineStore('contestants', () => {
  const contestants = ref<Contestant[]>([])
  const lastFetched = ref<number | null>(null)

  async function fetchContestants() {
    const now = Date.now()
    if (lastFetched.value && now - lastFetched.value < FIVE_MINUTES) {
      return
    }

    const { data, error } = await supabase.from('contestants').select(`
        id,
        first_name,
        last_name,
        career_wins,
        seasons_competed,
        teams (
          id,
          name,
          description,
          color
        )
      `)

    if (error || !data) {
      console.error('Error fetching contestants:', error)
      return
    }

    // Fetch all contestant results to calculate aggregated values
    const { data: resultsData, error: resultsError } = await supabase
      .from('contestant_results')
      .select('contestant_id, placement, prize')

    if (resultsError) {
      console.error('Error fetching contestant results:', resultsError)
      return
    }

    // Calculate aggregated values per contestant
    const contestantStats = new Map<
      number,
      { totalPoints: number; totalPodiums: number; totalFirstPlaces: number }
    >()

    ;(resultsData || []).forEach((result: ContestantResultRow) => {
      const contestantId = result.contestant_id
      const current = contestantStats.get(contestantId) || {
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

      contestantStats.set(contestantId, current)
    })

    // Transform to Contestant type and sort by total points (descending)
    contestants.value = data
      .map((contestant: ContestantRow) => {
        const stats = contestantStats.get(contestant.id) || {
          totalPoints: 0,
          totalPodiums: 0,
          totalFirstPlaces: 0,
        }

        return {
          id: contestant.id,
          firstName: contestant.first_name,
          lastName: contestant.last_name,
          careerWins: contestant.career_wins,
          seasonsCompeted: contestant.seasons_competed,
          team: {
            id: contestant.teams.id,
            name: contestant.teams.name,
            description: contestant.teams.description,
            color: contestant.teams.color,
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
