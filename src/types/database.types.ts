export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      contestants: {
        Row: {
          id: number
          created_at: string
          first_name: string
          last_name: string
          career_wins: number
          seasons_competed: number
          image_url: string
          team_id: number
          role: string | null
          paralympics_participations: number | null
          total_wins: number | null
          rating_selvtillit: number | null
          rating_logisk_tenkning: number | null
          rating_reaksjonsevne: number | null
          rating_samarbeidsevne: number | null
          rating_kommunikasjon: number | null
        }
        Insert: {
          id?: number
          created_at?: string
          first_name: string
          last_name: string
          career_wins: number
          seasons_competed: number
          image_url: string
          team_id: number
          role?: string | null
          paralympics_participations?: number | null
          total_wins?: number | null
          rating_selvtillit?: number | null
          rating_logisk_tenkning?: number | null
          rating_reaksjonsevne?: number | null
          rating_samarbeidsevne?: number | null
          rating_kommunikasjon?: number | null
        }
        Update: {
          id?: number
          created_at?: string
          first_name?: string
          last_name?: string
          career_wins?: number
          seasons_competed?: number
          image_url?: string
          team_id?: number
          role?: string | null
          paralympics_participations?: number | null
          total_wins?: number | null
          rating_selvtillit?: number | null
          rating_logisk_tenkning?: number | null
          rating_reaksjonsevne?: number | null
          rating_samarbeidsevne?: number | null
          rating_kommunikasjon?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'contestants_team_id_fkey'
            columns: ['team_id']
            isOneToOne: false
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
        ]
      }
      competitions: {
        Row: {
          id: number
          created_at: string
          name: string
          description: string | null
          date: string
          is_next: boolean
          is_finished: boolean
          image_url: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          description?: string | null
          date: string
          is_next?: boolean
          is_finished?: boolean
          image_url?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          description?: string | null
          date?: string
          is_next?: boolean
          is_finished?: boolean
          image_url?: string | null
        }
        Relationships: []
      }
      contestant_results: {
        Row: {
          id: number
          created_at: string
          competition_id: number
          contestant_id: number
          placement: number
          prize: number
        }
        Insert: {
          id?: number
          created_at?: string
          competition_id: number
          contestant_id: number
          placement: number
          prize: number
        }
        Update: {
          id?: number
          created_at?: string
          competition_id?: number
          contestant_id?: number
          placement?: number
          prize?: number
        }
        Relationships: [
          {
            foreignKeyName: 'contestant_results_competition_id_fkey'
            columns: ['competition_id']
            isOneToOne: false
            referencedRelation: 'competitions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'contestant_results_contestant_id_fkey'
            columns: ['contestant_id']
            isOneToOne: false
            referencedRelation: 'contestants'
            referencedColumns: ['id']
          },
        ]
      }
      current_competition: {
        Row: {
          id: number
          created_at: string
          competition_id: number
          contestant_id: number
          result: number
          metric: string
        }
        Insert: {
          id?: number
          created_at?: string
          competition_id: number
          contestant_id: number
          result: number
          metric: string
        }
        Update: {
          id?: number
          created_at?: string
          competition_id?: number
          contestant_id?: number
          result?: number
          metric?: string
        }
        Relationships: [
          {
            foreignKeyName: 'current_competition_competition_id_fkey'
            columns: ['competition_id']
            isOneToOne: false
            referencedRelation: 'competitions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'current_competition_contestant_id_fkey'
            columns: ['contestant_id']
            isOneToOne: false
            referencedRelation: 'contestants'
            referencedColumns: ['id']
          },
        ]
      }
      team_results: {
        Row: {
          id: number
          created_at: string
          competition_id: number
          team_id: number
          placement: number
          prize: number
        }
        Insert: {
          id?: number
          created_at?: string
          competition_id: number
          team_id: number
          placement: number
          prize: number
        }
        Update: {
          id?: number
          created_at?: string
          competition_id?: number
          team_id?: number
          placement?: number
          prize?: number
        }
        Relationships: [
          {
            foreignKeyName: 'team_results_competition_id_fkey'
            columns: ['competition_id']
            isOneToOne: false
            referencedRelation: 'competitions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'team_results_team_id_fkey'
            columns: ['team_id']
            isOneToOne: false
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
        ]
      }
      teams: {
        Row: {
          id: number
          name: string
          description: string | null
          color: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          color: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          color?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
