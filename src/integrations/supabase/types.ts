export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_prompts: {
        Row: {
          created_at: string
          id: string
          name: string
          prompt: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          prompt: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          prompt?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard: {
        Row: {
          created_at: string
          current_credits: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_credits?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_credits?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rss_feeds: {
        Row: {
          created_at: string
          feed_type: string
          id: string
          is_x_source: boolean
          name: string
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feed_type: string
          id?: string
          is_x_source?: boolean
          name: string
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          feed_type?: string
          id?: string
          is_x_source?: boolean
          name?: string
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          ai_prompt_id: string
          created_at: string
          end_time_utc: string
          friday: boolean
          id: string
          image_option: boolean
          last_url: string | null
          minute_intervals: number
          monday: boolean
          name: string
          rss_feed_id: string
          saturday: boolean
          start_time_utc: string
          sunday: boolean
          thursday: boolean
          timezone: string
          tuesday: boolean
          updated_at: string
          user_id: string
          video_option: boolean
          wednesday: boolean
          x_account_id: string
        }
        Insert: {
          ai_prompt_id: string
          created_at?: string
          end_time_utc: string
          friday?: boolean
          id?: string
          image_option?: boolean
          last_url?: string | null
          minute_intervals: number
          monday?: boolean
          name: string
          rss_feed_id: string
          saturday?: boolean
          start_time_utc: string
          sunday?: boolean
          thursday?: boolean
          timezone: string
          tuesday?: boolean
          updated_at?: string
          user_id: string
          video_option?: boolean
          wednesday?: boolean
          x_account_id: string
        }
        Update: {
          ai_prompt_id?: string
          created_at?: string
          end_time_utc?: string
          friday?: boolean
          id?: string
          image_option?: boolean
          last_url?: string | null
          minute_intervals?: number
          monday?: boolean
          name?: string
          rss_feed_id?: string
          saturday?: boolean
          start_time_utc?: string
          sunday?: boolean
          thursday?: boolean
          timezone?: string
          tuesday?: boolean
          updated_at?: string
          user_id?: string
          video_option?: boolean
          wednesday?: boolean
          x_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_ai_prompt_id_fkey"
            columns: ["ai_prompt_id"]
            isOneToOne: false
            referencedRelation: "ai_prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_rss_feed_id_fkey"
            columns: ["rss_feed_id"]
            isOneToOne: false
            referencedRelation: "rss_feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_x_account_id_fkey"
            columns: ["x_account_id"]
            isOneToOne: false
            referencedRelation: "x_credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      x_credentials: {
        Row: {
          access_token: string
          access_token_secret: string
          account_name: string
          api_key: string
          api_secret_key: string
          bearer_token: string
          created_at: string
          id: string
          latest_post: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          access_token_secret: string
          account_name: string
          api_key: string
          api_secret_key: string
          bearer_token: string
          created_at?: string
          id?: string
          latest_post?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          access_token_secret?: string
          account_name?: string
          api_key?: string
          api_secret_key?: string
          bearer_token?: string
          created_at?: string
          id?: string
          latest_post?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_duplicate_content: {
        Args: { schedule_id: string; content_hash: string; hours: number }
        Returns: {
          is_duplicate: boolean
        }[]
      }
      decrement: {
        Args: { val: number }
        Returns: number
      }
      get_active_schedules: {
        Args: { check_time: string }
        Returns: {
          id: string
          name: string
        }[]
      }
      get_and_lock_schedule: {
        Args: { schedule_id: string }
        Returns: Json
      }
      release_schedule_lock: {
        Args: { schedule_id: string }
        Returns: undefined
      }
      update_post_records: {
        Args: {
          schedule_id: string
          last_url: string
          content_hash: string
          tweet_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      access_level: "FREE" | "BEGINNER" | "PRO" | "BUSINESS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_level: ["FREE", "BEGINNER", "PRO", "BUSINESS"],
    },
  },
} as const
