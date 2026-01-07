export interface Team {
  id: number
  name: string
  description: string | null
  color: string
}

export interface Contestant {
  id: number
  firstName: string
  lastName: string
  careerWins: number
  seasonsCompeted: number
  team: Team
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
