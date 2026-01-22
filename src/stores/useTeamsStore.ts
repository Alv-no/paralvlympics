import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Team } from '@/types/api-types'
import { useResultsStore } from './useResultsStore'

const FIVE_MINUTES = 5 * 60 * 1000

interface TeamRow {
  id: number
  name: string
  description: string | null
  color: string
}

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<Team[]>([])
  const lastFetched = ref<number | null>(null)

  async function fetchTeams() {
    const now = Date.now()
    if (lastFetched.value && now - lastFetched.value < FIVE_MINUTES) {
      return
    }

    // Reuse results from useResultsStore
    const resultsStore = useResultsStore()
    if (resultsStore.teamStats.size === 0) {
      await resultsStore.fetchResults()
    }

    const { data, error } = await supabase.from('teams').select(`
        id,
        name,
        description,
        color
      `)

    if (error || !data) {
      console.error('Error fetching teams:', error)
      return
    }

    // Transform to Team type using stats from results store
    teams.value = data.map((team: TeamRow) => {
      const stats = resultsStore.teamStats.get(team.id) || {
        totalPoints: 0,
      }

      return {
        id: team.id,
        name: team.name,
        description: team.description,
        color: team.color,
        totalPoints: stats.totalPoints,
      }
    })

    lastFetched.value = now
  }

  return { teams, fetchTeams }
})
