export interface Team {
  id: number
  name: string
  description: string | null
  color: string
  totalPoints: number
}

export interface Contestant {
  id: number
  firstName: string
  lastName: string
  imageUrl: string
  totalPoints: number
  totalPodiums: number
  totalFirstPlaces: number
  careerWins: number
  seasonsCompeted: number
  team: {
    id: number
    name: string
    color: string
  }
  paralympicsParticipations: number
  totalWins: number
}

export interface Competition {
  id: number
  name: string
  description: string | null
  date: string
  isNext: boolean
  isFinished: boolean
  imageUrl: string | null
  contestantsResults: ContestantResult[]
  teamResults: TeamResult[]
}

export interface ContestantResult {
  id: string
  contestant: Contestant
  placement: number
  prize: number
}

export interface TeamResult {
  id: string
  team: Team
  placement: number
  prize: number
}

export interface CurrentCompetitionEntry {
  id: number
  created_at: string
  competition_id: number
  contestant_id: number
  result: number
  metric: string
}