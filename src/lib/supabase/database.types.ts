export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievement_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          idempotency_key: string
          member_id: string
          occurred_at: string
          processed_at: string | null
          reference_id: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          idempotency_key: string
          member_id: string
          occurred_at?: string
          processed_at?: string | null
          reference_id?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          idempotency_key?: string
          member_id?: string
          occurred_at?: string
          processed_at?: string | null
          reference_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "achievement_events_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          category: string
          created_at: string
          custom_icon_media_id: string | null
          description: string
          icon_key: string
          id: string
          is_active: boolean
          is_manual: boolean
          is_secret: boolean
          metric_type: string
          parent_achievement_id: string | null
          rule_config: Json
          share_text: string | null
          slug: string
          sort_order: number
          threshold: number | null
          tier: string | null
          title: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          category: string
          created_at?: string
          custom_icon_media_id?: string | null
          description: string
          icon_key: string
          id?: string
          is_active?: boolean
          is_manual?: boolean
          is_secret?: boolean
          metric_type: string
          parent_achievement_id?: string | null
          rule_config?: Json
          share_text?: string | null
          slug: string
          sort_order?: number
          threshold?: number | null
          tier?: string | null
          title: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          custom_icon_media_id?: string | null
          description?: string
          icon_key?: string
          id?: string
          is_active?: boolean
          is_manual?: boolean
          is_secret?: boolean
          metric_type?: string
          parent_achievement_id?: string | null
          rule_config?: Json
          share_text?: string | null
          slug?: string
          sort_order?: number
          threshold?: number | null
          tier?: string | null
          title?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_custom_icon_media_id_fkey"
            columns: ["custom_icon_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievements_parent_achievement_id_fkey"
            columns: ["parent_achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_type: string
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          inquiry_id: string | null
          notes: string | null
          starts_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          appointment_type: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          inquiry_id?: string | null
          notes?: string | null
          starts_at: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          appointment_type?: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          inquiry_id?: string | null
          notes?: string | null
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_value: Json | null
          previous_value: Json | null
          summary: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
          summary: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      body_measurements: {
        Row: {
          body_fat_pct: number | null
          chest_cm: number | null
          created_at: string
          hip_cm: number | null
          id: string
          measured_at: string
          member_id: string
          notes: string | null
          waist_cm: number | null
          weight_kg: number | null
        }
        Insert: {
          body_fat_pct?: number | null
          chest_cm?: number | null
          created_at?: string
          hip_cm?: number | null
          id?: string
          measured_at?: string
          member_id: string
          notes?: string | null
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Update: {
          body_fat_pct?: number | null
          chest_cm?: number | null
          created_at?: string
          hip_cm?: number | null
          id?: string
          measured_at?: string
          member_id?: string
          notes?: string | null
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "body_measurements_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          member_id: string
          read_at: string | null
          sender_id: string
          sender_role: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          member_id: string
          read_at?: string | null
          sender_id: string
          sender_role: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          member_id?: string
          read_at?: string | null
          sender_id?: string
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_messages_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_versions: {
        Row: {
          content: Json
          id: string
          published_at: string
          published_by: string | null
          section_id: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          content: Json
          id?: string
          published_at?: string
          published_by?: string | null
          section_id: string
          sort_order: number
          visible: boolean
        }
        Update: {
          content?: Json
          id?: string
          published_at?: string
          published_by?: string | null
          section_id?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_versions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "website_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          alternative_exercise_id: string | null
          created_at: string
          default_reps: string
          default_sets: number
          description: string | null
          id: string
          image_media_id: string | null
          muscle_group: string | null
          name: string
          updated_at: string
          video_media_id: string | null
        }
        Insert: {
          alternative_exercise_id?: string | null
          created_at?: string
          default_reps?: string
          default_sets?: number
          description?: string | null
          id?: string
          image_media_id?: string | null
          muscle_group?: string | null
          name: string
          updated_at?: string
          video_media_id?: string | null
        }
        Update: {
          alternative_exercise_id?: string | null
          created_at?: string
          default_reps?: string
          default_sets?: number
          description?: string | null
          id?: string
          image_media_id?: string | null
          muscle_group?: string | null
          name?: string
          updated_at?: string
          video_media_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_alternative_exercise_id_fkey"
            columns: ["alternative_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_image_media_id_fkey"
            columns: ["image_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_video_media_id_fkey"
            columns: ["video_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      health_consents: {
        Row: {
          created_at: string
          event: string
          id: string
          member_id: string
          policy_version: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          member_id: string
          policy_version?: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          member_id?: string
          policy_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_consents_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          archived: boolean
          area: string
          assigned_to: string | null
          callback_date: string | null
          consent: boolean
          created_at: string
          email: string
          first_name: string
          id: string
          ip_hash: string | null
          last_name: string
          message: string | null
          phone: string | null
          preferred_date: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          archived?: boolean
          area: string
          assigned_to?: string | null
          callback_date?: string | null
          consent?: boolean
          created_at?: string
          email: string
          first_name: string
          id?: string
          ip_hash?: string | null
          last_name: string
          message?: string | null
          phone?: string | null
          preferred_date?: string | null
          source: string
          status?: string
          updated_at?: string
        }
        Update: {
          archived?: boolean
          area?: string
          assigned_to?: string | null
          callback_date?: string | null
          consent?: boolean
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          ip_hash?: string | null
          last_name?: string
          message?: string | null
          phone?: string | null
          preferred_date?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiry_notes: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          inquiry_id: string
          note: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          inquiry_id: string
          note: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          inquiry_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiry_notes_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          area: string | null
          created_at: string
          crop: Json | null
          file_size: number
          file_type: string
          height: number | null
          id: string
          mime_type: string
          poster_media_id: string | null
          sort_order: number
          storage_bucket: string
          storage_path: string
          title: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          area?: string | null
          created_at?: string
          crop?: Json | null
          file_size?: number
          file_type: string
          height?: number | null
          id?: string
          mime_type: string
          poster_media_id?: string | null
          sort_order?: number
          storage_bucket: string
          storage_path: string
          title: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          area?: string | null
          created_at?: string
          crop?: Json | null
          file_size?: number
          file_type?: string
          height?: number | null
          id?: string
          mime_type?: string
          poster_media_id?: string | null
          sort_order?: number
          storage_bucket?: string
          storage_path?: string
          title?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_poster_media_id_fkey"
            columns: ["poster_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      member_achievements: {
        Row: {
          achievement_id: string
          awarded_by: string | null
          created_at: string
          id: string
          internal_note: string | null
          member_id: string
          progress: number
          revoke_reason: string | null
          revoked_at: string | null
          revoked_by: string | null
          trainer_message: string | null
          unlocked_at: string | null
          updated_at: string
        }
        Insert: {
          achievement_id: string
          awarded_by?: string | null
          created_at?: string
          id?: string
          internal_note?: string | null
          member_id: string
          progress?: number
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          trainer_message?: string | null
          unlocked_at?: string | null
          updated_at?: string
        }
        Update: {
          achievement_id?: string
          awarded_by?: string | null
          created_at?: string
          id?: string
          internal_note?: string | null
          member_id?: string
          progress?: number
          revoke_reason?: string | null
          revoked_at?: string | null
          revoked_by?: string | null
          trainer_message?: string | null
          unlocked_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_achievements_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_achievements_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_achievements_revoked_by_fkey"
            columns: ["revoked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      member_profiles: {
        Row: {
          assigned_trainer_id: string | null
          birth_year: number | null
          created_at: string
          excluded_exercises: string[]
          experience_level: string | null
          focus_areas: string[]
          goal: string | null
          health_notes: string | null
          height_cm: number | null
          id: string
          intensity_preference: string | null
          next_analysis_date: string | null
          onboarding_completed_at: string | null
          preferences: string | null
          session_duration_min: number | null
          training_days_per_week: number | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          assigned_trainer_id?: string | null
          birth_year?: number | null
          created_at?: string
          excluded_exercises?: string[]
          experience_level?: string | null
          focus_areas?: string[]
          goal?: string | null
          health_notes?: string | null
          height_cm?: number | null
          id: string
          intensity_preference?: string | null
          next_analysis_date?: string | null
          onboarding_completed_at?: string | null
          preferences?: string | null
          session_duration_min?: number | null
          training_days_per_week?: number | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          assigned_trainer_id?: string | null
          birth_year?: number | null
          created_at?: string
          excluded_exercises?: string[]
          experience_level?: string | null
          focus_areas?: string[]
          goal?: string | null
          health_notes?: string | null
          height_cm?: number | null
          id?: string
          intensity_preference?: string | null
          next_analysis_date?: string | null
          onboarding_completed_at?: string | null
          preferences?: string | null
          session_duration_min?: number | null
          training_days_per_week?: number | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "member_profiles_assigned_trainer_id_fkey"
            columns: ["assigned_trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          billing_period: string | null
          category: string
          contract_duration: string | null
          created_at: string
          description: string | null
          features: Json
          highlighted: boolean
          id: string
          price_cents: number | null
          price_note: string | null
          published: boolean
          sort_order: number
          title: string
          updated_at: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          billing_period?: string | null
          category: string
          contract_duration?: string | null
          created_at?: string
          description?: string | null
          features?: Json
          highlighted?: boolean
          id?: string
          price_cents?: number | null
          price_note?: string | null
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          billing_period?: string | null
          category?: string
          contract_duration?: string | null
          created_at?: string
          description?: string | null
          features?: Json
          highlighted?: boolean
          id?: string
          price_cents?: number | null
          price_note?: string | null
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      opening_hours: {
        Row: {
          close_time: string | null
          closed: boolean
          id: string
          open_time: string | null
          sort_order: number
          weekday: string
        }
        Insert: {
          close_time?: string | null
          closed?: boolean
          id?: string
          open_time?: string | null
          sort_order?: number
          weekday: string
        }
        Update: {
          close_time?: string | null
          closed?: boolean
          id?: string
          open_time?: string | null
          sort_order?: number
          weekday?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          id: string
          link_url: string | null
          logo_media_id: string | null
          name: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          link_url?: string | null
          logo_media_id?: string | null
          name: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          link_url?: string | null
          logo_media_id?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "partners_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_change_requests: {
        Row: {
          created_at: string
          id: string
          member_id: string
          message: string
          plan_id: string
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          message: string
          plan_id: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          message?: string
          plan_id?: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_change_requests_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_change_requests_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_change_requests_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available_in_store: boolean
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_media_id: string | null
          name: string
          partner_id: string | null
          recommended: boolean
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          available_in_store?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_media_id?: string | null
          name: string
          partner_id?: string | null
          recommended?: boolean
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          available_in_store?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_media_id?: string | null
          name?: string
          partner_id?: string | null
          recommended?: boolean
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "products_image_media_id_fkey"
            columns: ["image_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      special_opening_hours: {
        Row: {
          close_time: string | null
          closed: boolean
          created_at: string
          date_from: string
          date_to: string | null
          id: string
          label: string
          note: string | null
          open_time: string | null
        }
        Insert: {
          close_time?: string | null
          closed?: boolean
          created_at?: string
          date_from: string
          date_to?: string | null
          id?: string
          label: string
          note?: string | null
          open_time?: string | null
        }
        Update: {
          close_time?: string | null
          closed?: boolean
          created_at?: string
          date_from?: string
          date_to?: string | null
          id?: string
          label?: string
          note?: string | null
          open_time?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          focus_areas: Json
          id: string
          is_owner: boolean
          name: string
          photo_media_id: string | null
          qualifications: Json
          role_title: string | null
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          focus_areas?: Json
          id?: string
          is_owner?: boolean
          name: string
          photo_media_id?: string | null
          qualifications?: Json
          role_title?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          focus_areas?: Json
          id?: string
          is_owner?: boolean
          name?: string
          photo_media_id?: string | null
          qualifications?: Json
          role_title?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "team_members_photo_media_id_fkey"
            columns: ["photo_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          id: string
          member_id: string
          note: string | null
          trainer_id: string | null
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          member_id: string
          note?: string | null
          trainer_id?: string | null
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          member_id?: string
          note?: string | null
          trainer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_assignments_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plan_days: {
        Row: {
          id: string
          plan_id: string
          sort_order: number
          title: string
          weekday: string
        }
        Insert: {
          id?: string
          plan_id: string
          sort_order?: number
          title: string
          weekday: string
        }
        Update: {
          id?: string
          plan_id?: string
          sort_order?: number
          title?: string
          weekday?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plan_exercises: {
        Row: {
          alternative_exercise_id: string | null
          exercise_id: string
          id: string
          plan_day_id: string
          reps: string
          rest_seconds: number
          sets: number
          sort_order: number
          target_weight_kg: number | null
          trainer_note: string | null
        }
        Insert: {
          alternative_exercise_id?: string | null
          exercise_id: string
          id?: string
          plan_day_id: string
          reps?: string
          rest_seconds?: number
          sets?: number
          sort_order?: number
          target_weight_kg?: number | null
          trainer_note?: string | null
        }
        Update: {
          alternative_exercise_id?: string | null
          exercise_id?: string
          id?: string
          plan_day_id?: string
          reps?: string
          rest_seconds?: number
          sets?: number
          sort_order?: number
          target_weight_kg?: number | null
          trainer_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_plan_exercises_alternative_exercise_id_fkey"
            columns: ["alternative_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plan_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plan_exercises_plan_day_id_fkey"
            columns: ["plan_day_id"]
            isOneToOne: false
            referencedRelation: "training_plan_days"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plan_templates: {
        Row: {
          created_at: string
          days: Json
          description: string | null
          goal: string
          id: string
          level: string
          name: string
        }
        Insert: {
          created_at?: string
          days: Json
          description?: string | null
          goal: string
          id?: string
          level: string
          name: string
        }
        Update: {
          created_at?: string
          days?: Json
          description?: string | null
          goal?: string
          id?: string
          level?: string
          name?: string
        }
        Relationships: []
      }
      training_plans: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          member_id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source_template_id: string | null
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          member_id: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_template_id?: string | null
          status?: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          member_id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_template_id?: string | null
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plans_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plans_source_template_id_fkey"
            columns: ["source_template_id"]
            isOneToOne: false
            referencedRelation: "training_plan_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      website_drafts: {
        Row: {
          content: Json
          id: string
          section_id: string
          sort_order: number
          updated_at: string
          updated_by: string | null
          visible: boolean
        }
        Insert: {
          content: Json
          id?: string
          section_id: string
          sort_order: number
          updated_at?: string
          updated_by?: string | null
          visible: boolean
        }
        Update: {
          content?: Json
          id?: string
          section_id?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "website_drafts_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: true
            referencedRelation: "website_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_drafts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      website_sections: {
        Row: {
          content: Json
          id: string
          page: string
          section_key: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
          updated_by: string | null
          visible: boolean
        }
        Insert: {
          content?: Json
          id?: string
          page: string
          section_key: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Update: {
          content?: Json
          id?: string
          page?: string
          section_key?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "website_sections_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_min: number | null
          feeling_note: string | null
          id: string
          member_id: string
          plan_day_id: string | null
          plan_id: string | null
          started_at: string
          total_volume_kg: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_min?: number | null
          feeling_note?: string | null
          id?: string
          member_id: string
          plan_day_id?: string | null
          plan_id?: string | null
          started_at?: string
          total_volume_kg?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_min?: number | null
          feeling_note?: string | null
          id?: string
          member_id?: string
          plan_day_id?: string | null
          plan_id?: string | null
          started_at?: string
          total_volume_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_plan_day_id_fkey"
            columns: ["plan_day_id"]
            isOneToOne: false
            referencedRelation: "training_plan_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sets: {
        Row: {
          completed_at: string
          id: string
          note: string | null
          pain_flag: boolean
          perceived_exertion: number | null
          plan_exercise_id: string | null
          reps: number | null
          session_id: string
          set_number: number
          weight_kg: number | null
        }
        Insert: {
          completed_at?: string
          id?: string
          note?: string | null
          pain_flag?: boolean
          perceived_exertion?: number | null
          plan_exercise_id?: string | null
          reps?: number | null
          session_id: string
          set_number: number
          weight_kg?: number | null
        }
        Update: {
          completed_at?: string
          id?: string
          note?: string | null
          pain_flag?: boolean
          perceived_exertion?: number | null
          plan_exercise_id?: string | null
          reps?: number | null
          session_id?: string
          set_number?: number
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_plan_exercise_id_fkey"
            columns: ["plan_exercise_id"]
            isOneToOne: false
            referencedRelation: "training_plan_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sets_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_training_plan: { Args: { p_plan_id: string }; Returns: boolean }
      assigned_trainer_of: { Args: { p_member_id: string }; Returns: string }
      award_manual_achievement: {
        Args: {
          p_achievement_slug: string
          p_internal_note?: string
          p_member_id: string
          p_trainer_message?: string
        }
        Returns: string
      }
      current_profile_role: { Args: never; Returns: string }
      generate_draft_plan: {
        Args: { p_member_id: string; p_template_id: string }
        Returns: string
      }
      get_notification_email: { Args: never; Returns: string }
      get_weekly_visitor_count: { Args: never; Returns: number }
      is_admin: { Args: never; Returns: boolean }
      is_member: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      is_trainer: { Args: never; Returns: boolean }
      is_trainer_or_admin: { Args: never; Returns: boolean }
      prune_old_page_views: { Args: never; Returns: undefined }
      publish_all_drafts: { Args: { p_actor: string }; Returns: number }
      restore_last_version: {
        Args: { p_actor: string; p_section_id: string }
        Returns: boolean
      }
      revoke_member_achievement: {
        Args: { p_member_achievement_id: string; p_reason: string }
        Returns: boolean
      }
      submit_inquiry: {
        Args: {
          p_area: string
          p_consent: boolean
          p_email: string
          p_first_name: string
          p_ip_hash: string | null
          p_last_name: string
          p_message: string | null
          p_phone: string | null
          p_preferred_date: string | null
          p_source: string
        }
        Returns: string
      }
      unlock_achievement: {
        Args: {
          p_achievement_slug: string
          p_member_id: string
          p_progress: number
          p_unlock?: boolean
        }
        Returns: {
          member_achievement_id: string
          unlocked_now: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
