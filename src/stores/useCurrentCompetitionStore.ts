import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Contestant } from '@/types/api-types'
import type { Tables } from '@/types/database.types'

const FIVE_MINUTES = 5 * 60 * 1000

type CurrentCompetitionRow = Tables<'current_competition'>

export interface ContestantResult {
  contestant: Contestant
  results: number[]
  bestResult: number
  metric: string
  points: number
  placement: number
}

export const useCurrentCompetitionStore = defineStore('currentCompetition', () => {
  const currentCompetitionData = ref<CurrentCompetitionRow[]>([])
  const lastFetched = ref<number | null>(null)
  const lastFetchedCompetitionId = ref<number | null>(null)

  async function fetchDataForCompetition(competitionId: number) {
    const now = Date.now()
    if (
      lastFetched.value &&
      now - lastFetched.value < FIVE_MINUTES &&
      lastFetchedCompetitionId.value === competitionId
    ) {
      console.log('cache hit, skipping fetch for competitionId:', competitionId)
      return
    }

    console.log('fetching for competitionId:', competitionId)

    const { data, error } = await supabase
      .from('current_competition')
      .select('*')
      .eq('competition_id', competitionId)
      .order('id', { ascending: true })

    console.log('data:', data)
    console.log('error:', error)

    if (error || !data) {
      console.error('Error fetching current competition data:', error)
      return
    }

    currentCompetitionData.value = data as CurrentCompetitionRow[]
    lastFetched.value = now
    lastFetchedCompetitionId.value = competitionId
  }

  function getResultsForCompetition(
    competitionId: number,
    contestants: Contestant[]
  ): ContestantResult[] {
    const competitionEntries = currentCompetitionData.value.filter(
      e => e.competition_id === competitionId
    )

    console.log('getResultsForCompetition - competitionId:', competitionId)
    console.log('getResultsForCompetition - currentCompetitionData:', currentCompetitionData.value)
    console.log('getResultsForCompetition - competitionEntries:', competitionEntries)
    console.log('getResultsForCompetition - contestants:', contestants.length)

    const contestantMap = new Map(contestants.map(c => [c.id, c]))

    const grouped = new Map<number, number[]>()
    for (const entry of competitionEntries) {
      if (!grouped.has(entry.contestant_id)) grouped.set(entry.contestant_id, [])
      grouped.get(entry.contestant_id)!.push(entry.result)
    }

    const results: Omit<ContestantResult, 'placement'>[] = []
    for (const [contestantId, entryResults] of grouped.entries()) {
      const contestant = contestantMap.get(contestantId)
      if (!contestant) continue

      const best = Math.max(...entryResults)
      const metric = competitionEntries.find(e => e.contestant_id === contestantId)?.metric ?? ''
      results.push({
        contestant,
        results: entryResults,
        bestResult: best,
        metric,
        points: 0,
      })
    }

    results.sort((a, b) => b.bestResult - a.bestResult)

    const pointsScale = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
    return results.map((r, i) => ({
      ...r,
      points: pointsScale[i] ?? 0,
      placement: i + 1,
    }))
  }

  function invalidate() {
    lastFetched.value = null
    lastFetchedCompetitionId.value = null
  }

  return { currentCompetitionData, fetchDataForCompetition, getResultsForCompetition, invalidate }
})