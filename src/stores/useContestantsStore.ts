import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Contestant } from '@/types/api-types'

const FIVE_MINUTES = 5 * 60 * 1000

export const useContestantsStore = defineStore('contestants', () => {
  const contestants = ref<Contestant[]>([])
  const lastFetched = ref<number | null>(null)

  async function fetchContestants() {
    const now = Date.now()
    if (lastFetched.value && now - lastFetched.value < FIVE_MINUTES) {
      return
    }

    const { data, error } = await supabase
      .from('contestants')
      .select(`
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

    // Transform to Contestant type
    contestants.value = data.map((contestant: any) => ({
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
      },
    }))

    lastFetched.value = now
  }

  return { contestants, fetchContestants }
})
