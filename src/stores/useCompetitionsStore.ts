import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { Competition } from '@/types/api-types'
import type { Tables } from '@/types/database.types'

const FIVE_MINUTES = 5 * 60 * 1000

type CompetitionRow = Tables<'competitions'>
type ContestantResultRow = Tables<'contestant_results'>
type TeamResultRow = Tables<'team_results'>
type ContestantRow = Tables<'contestants'>
type TeamRow = Tables<'teams'>

type CompetitionWithResults = CompetitionRow & {
  contestant_results?: ContestantResultRow[]
  team_results?: TeamResultRow[]
}

type ContestantWithTeam = ContestantRow & {
  teams?: TeamRow
}

export const useCompetitionsStore = defineStore('competitions', () => {
  const competitions = ref<Competition[]>([])
  const lastFetched = ref<number | null>(null)

  async function fetchCompetitions() {
    const now = Date.now()
    if (lastFetched.value && now - lastFetched.value < FIVE_MINUTES) {
      return
    }

    // Fetch competitions with nested contestant_results and team_results
    const { data: competitionsData, error: competitionsError } = await supabase
      .from('competitions')
      .select(`
        *,
        contestant_results(*),
        team_results(*)
      `)

    if (competitionsError || !competitionsData) {
      console.error('Error fetching competitions:', competitionsError)
      return
    }

    // Collect all unique contestant IDs and team IDs from team_results
    const contestantIds = new Set<number>()
    const teamResultTeamIds = new Set<number>()

    competitionsData.forEach((comp: CompetitionWithResults) => {
      comp.contestant_results?.forEach((cr: ContestantResultRow) => {
        contestantIds.add(cr.contestant_id)
      })
      comp.team_results?.forEach((tr: TeamResultRow) => {
        teamResultTeamIds.add(tr.team_id)
      })
    })

    // Fetch contestants with nested teams
    const contestantsResult = await supabase
      .from('contestants')
      .select('*, teams(*)')
      .in('id', Array.from(contestantIds))

    const contestantsData = (contestantsResult.data || []) as ContestantWithTeam[]

    // Collect team IDs from contestants and determine which teams we still need
    const contestantTeamIds = new Set<number>()
    contestantsData.forEach((c: ContestantWithTeam) => {
      if (c.team_id) contestantTeamIds.add(c.team_id)
    })

    // Get teams needed for team_results that aren't already fetched via contestants
    const remainingTeamIds = Array.from(teamResultTeamIds).filter(id => !contestantTeamIds.has(id))

    // Fetch remaining teams (if any) and combine with teams from contestants
    const teamsMap = new Map<number, TeamRow>()

    // Add teams from contestants
    contestantsData.forEach((c: ContestantWithTeam) => {
      if (c.teams) {
        teamsMap.set(c.teams.id, c.teams)
      }
    })

    // Fetch remaining teams for team_results if needed
    if (remainingTeamIds.length > 0) {
      const teamsResult = await supabase
        .from('teams')
        .select('*')
        .in('id', remainingTeamIds)

      ;(teamsResult.data || []).forEach((t: TeamRow) => {
        teamsMap.set(t.id, t)
      })
    }

    // Create contestants lookup map
    const contestantsMap = new Map(contestantsData.map(c => [c.id, c]))

    // Transform to Competition type and sort by id
    competitions.value = competitionsData
      .slice()
      .sort((a, b) => a.id - b.id)
      .map((comp: CompetitionWithResults) => {
        const contestantResults = (comp.contestant_results || []).map((cr: ContestantResultRow) => {
          const contestant = contestantsMap.get(cr.contestant_id)!
          const team = contestant.teams || teamsMap.get(contestant.team_id)!
          return {
            id: cr.id.toString(),
            placement: cr.placement,
            prize: cr.prize,
            contestant: {
              id: contestant.id,
              firstName: contestant.first_name,
              lastName: contestant.last_name,
              careerWins: contestant.career_wins,
              seasonsCompeted: contestant.seasons_competed,
              team: {
                id: team.id,
                name: team.name,
                description: team.description,
                color: team.color,
              },
            },
          }
        })

        const teamResults = (comp.team_results || []).map((tr: TeamResultRow) => {
          const team = teamsMap.get(tr.team_id)!
          return {
            id: tr.id.toString(),
            placement: tr.placement,
            prize: tr.prize,
            team: {
              id: team.id,
              name: team.name,
              description: team.description,
              color: team.color,
            },
          }
        })

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
