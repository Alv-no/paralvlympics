import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Team } from '@/types/api-types'

const FIVE_MINUTES = 5 * 60 * 1000

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<Team[]>([])
  const lastFetched = ref<number | null>(null)

  async function fetchTeams() {
    const now = Date.now()
    if (lastFetched.value && now - lastFetched.value < FIVE_MINUTES) {
      return
    }
    const { data } = await supabase.from('teams').select()
    if (!data) return

    teams.value = data
  }

  return { teams, fetchTeams }
})
