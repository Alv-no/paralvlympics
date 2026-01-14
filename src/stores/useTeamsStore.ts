import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Team } from '@/types/api-types'

const FIVE_MINUTES = 5 * 60 * 1000

interface TeamRow {
  id: number
  name: string
  description: string | null
  color: string
}

interface TeamResultRow {
  team_id: number
  prize: number
}

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<Team[]>([])
  const lastFetched = ref<number | null>(null)

  async function fetchTeams() {
    const now = Date.now()
    if (lastFetched.value && now - lastFetched.value < FIVE_MINUTES) {
      return
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

    // Fetch all team results to calculate aggregated values
    const { data: resultsData, error: resultsError } = await supabase
      .from('team_results')
      .select('team_id, prize')

    if (resultsError) {
      console.error('Error fetching team results:', resultsError)
      return
    }

    // Calculate aggregated values per team
    const teamStats = new Map<number, { totalPoints: number }>()

    ;(resultsData || []).forEach((result: TeamResultRow) => {
      const teamId = result.team_id
      const current = teamStats.get(teamId) || {
        totalPoints: 0,
      }

      current.totalPoints += result.prize || 0

      teamStats.set(teamId, current)
    })

    // Transform to Team type
    teams.value = data.map((team: TeamRow) => {
      const stats = teamStats.get(team.id) || {
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
