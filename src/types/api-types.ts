export interface Team {
  id: number
  name: string
  description: string | null
  color: string
  totalPoints: number
}


export interface Contestant {
  firstName: string
  lastName: string
  imageUrl: string
  totalPoints: number
  totalPodiums: number
  totalFirstPlaces: number
  careerWins: number
  team: {
    name: string
    color: string
  }

  role: string                      
  paralympicsParticipations: number 
  totalWins: number                 

  ratingSelvtillit: number
  ratingLogiskTenkning: number
  ratingReaksjonsevne: number
  ratingSamarbeidsevne: number
  ratingKommunikasjon: number
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
