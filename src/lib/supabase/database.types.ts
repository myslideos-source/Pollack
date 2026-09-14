// Auto-generated from the live Supabase schema (mcp__Supabase__generate_typescript_types).
// Regenerate after any migration change — do not hand-edit.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_type: string;
          created_at: string;
          created_by: string | null;
          ends_at: string | null;
          id: string;
          inquiry_id: string | null;
          notes: string | null;
          starts_at: string;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          appointment_type: string;
          created_at?: string;
          created_by?: string | null;
          ends_at?: string | null;
          id?: string;
          inquiry_id?: string | null;
          notes?: string | null;
          starts_at: string;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          appointment_type?: string;
          created_at?: string;
          created_by?: string | null;
          ends_at?: string | null;
          id?: string;
          inquiry_id?: string | null;
          notes?: string | null;
          starts_at?: string;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_inquiry_id_fkey";
            columns: ["inquiry_id"];
            isOneToOne: false;
            referencedRelation: "inquiries";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: string;
          new_value: Json | null;
          previous_value: Json | null;
          summary: string;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          new_value?: Json | null;
          previous_value?: Json | null;
          summary: string;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: string;
          new_value?: Json | null;
          previous_value?: Json | null;
          summary?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      content_versions: {
        Row: {
          content: Json;
          id: string;
          published_at: string;
          published_by: string | null;
          section_id: string;
          sort_order: number;
          visible: boolean;
        };
        Insert: {
          content: Json;
          id?: string;
          published_at?: string;
          published_by?: string | null;
          section_id: string;
          sort_order: number;
          visible: boolean;
        };
        Update: {
          content?: Json;
          id?: string;
          published_at?: string;
          published_by?: string | null;
          section_id?: string;
          sort_order?: number;
          visible?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "content_versions_published_by_fkey";
            columns: ["published_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_versions_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "website_sections";
            referencedColumns: ["id"];
          },
        ];
      };
      inquiries: {
        Row: {
          archived: boolean;
          area: string;
          assigned_to: string | null;
          callback_date: string | null;
          consent: boolean;
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          ip_hash: string | null;
          last_name: string;
          message: string | null;
          phone: string | null;
          preferred_date: string | null;
          source: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          archived?: boolean;
          area: string;
          assigned_to?: string | null;
          callback_date?: string | null;
          consent?: boolean;
          created_at?: string;
          email: string;
          first_name: string;
          id?: string;
          ip_hash?: string | null;
          last_name: string;
          message?: string | null;
          phone?: string | null;
          preferred_date?: string | null;
          source: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          archived?: boolean;
          area?: string;
          assigned_to?: string | null;
          callback_date?: string | null;
          consent?: boolean;
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          ip_hash?: string | null;
          last_name?: string;
          message?: string | null;
          phone?: string | null;
          preferred_date?: string | null;
          source?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inquiries_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      inquiry_notes: {
        Row: {
          author_id: string | null;
          created_at: string;
          id: string;
          inquiry_id: string;
          note: string;
        };
        Insert: {
          author_id?: string | null;
          created_at?: string;
          id?: string;
          inquiry_id: string;
          note: string;
        };
        Update: {
          author_id?: string | null;
          created_at?: string;
          id?: string;
          inquiry_id?: string;
          note?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inquiry_notes_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiry_notes_inquiry_id_fkey";
            columns: ["inquiry_id"];
            isOneToOne: false;
            referencedRelation: "inquiries";
            referencedColumns: ["id"];
          },
        ];
      };
      media: {
        Row: {
          alt_text: string | null;
          area: string | null;
          created_at: string;
          crop: Json | null;
          file_size: number;
          file_type: string;
          height: number | null;
          id: string;
          mime_type: string;
          poster_media_id: string | null;
          sort_order: number;
          storage_bucket: string;
          storage_path: string;
          title: string;
          uploaded_by: string | null;
          width: number | null;
        };
        Insert: {
          alt_text?: string | null;
          area?: string | null;
          created_at?: string;
          crop?: Json | null;
          file_size?: number;
          file_type: string;
          height?: number | null;
          id?: string;
          mime_type: string;
          poster_media_id?: string | null;
          sort_order?: number;
          storage_bucket: string;
          storage_path: string;
          title: string;
          uploaded_by?: string | null;
          width?: number | null;
        };
        Update: {
          alt_text?: string | null;
          area?: string | null;
          created_at?: string;
          crop?: Json | null;
          file_size?: number;
          file_type?: string;
          height?: number | null;
          id?: string;
          mime_type?: string;
          poster_media_id?: string | null;
          sort_order?: number;
          storage_bucket?: string;
          storage_path?: string;
          title?: string;
          uploaded_by?: string | null;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "media_poster_media_id_fkey";
            columns: ["poster_media_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      offers: {
        Row: {
          billing_period: string | null;
          category: string;
          contract_duration: string | null;
          created_at: string;
          description: string | null;
          features: Json;
          highlighted: boolean;
          id: string;
          price_cents: number | null;
          price_note: string | null;
          published: boolean;
          sort_order: number;
          title: string;
          updated_at: string;
          valid_from: string | null;
          valid_to: string | null;
        };
        Insert: {
          billing_period?: string | null;
          category: string;
          contract_duration?: string | null;
          created_at?: string;
          description?: string | null;
          features?: Json;
          highlighted?: boolean;
          id?: string;
          price_cents?: number | null;
          price_note?: string | null;
          published?: boolean;
          sort_order?: number;
          title: string;
          updated_at?: string;
          valid_from?: string | null;
          valid_to?: string | null;
        };
        Update: {
          billing_period?: string | null;
          category?: string;
          contract_duration?: string | null;
          created_at?: string;
          description?: string | null;
          features?: Json;
          highlighted?: boolean;
          id?: string;
          price_cents?: number | null;
          price_note?: string | null;
          published?: boolean;
          sort_order?: number;
          title?: string;
          updated_at?: string;
          valid_from?: string | null;
          valid_to?: string | null;
        };
        Relationships: [];
      };
      opening_hours: {
        Row: {
          close_time: string | null;
          closed: boolean;
          id: string;
          open_time: string | null;
          sort_order: number;
          weekday: string;
        };
        Insert: {
          close_time?: string | null;
          closed?: boolean;
          id?: string;
          open_time?: string | null;
          sort_order?: number;
          weekday: string;
        };
        Update: {
          close_time?: string | null;
          closed?: boolean;
          id?: string;
          open_time?: string | null;
          sort_order?: number;
          weekday?: string;
        };
        Relationships: [];
      };
      partners: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          link_url: string | null;
          logo_media_id: string | null;
          name: string;
          sort_order: number;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          link_url?: string | null;
          logo_media_id?: string | null;
          name: string;
          sort_order?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          link_url?: string | null;
          logo_media_id?: string | null;
          name?: string;
          sort_order?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "partners_logo_media_id_fkey";
            columns: ["logo_media_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          available_in_store: boolean;
          category: string | null;
          created_at: string;
          description: string | null;
          id: string;
          image_media_id: string | null;
          name: string;
          partner_id: string | null;
          recommended: boolean;
          sort_order: number;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          available_in_store?: boolean;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_media_id?: string | null;
          name: string;
          partner_id?: string | null;
          recommended?: boolean;
          sort_order?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          available_in_store?: boolean;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_media_id?: string | null;
          name?: string;
          partner_id?: string | null;
          recommended?: boolean;
          sort_order?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "products_image_media_id_fkey";
            columns: ["image_media_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          role: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          role: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          role?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          key: string;
          updated_at?: string;
          updated_by?: string | null;
          value: Json;
        };
        Update: {
          key?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      special_opening_hours: {
        Row: {
          close_time: string | null;
          closed: boolean;
          created_at: string;
          date_from: string;
          date_to: string | null;
          id: string;
          label: string;
          note: string | null;
          open_time: string | null;
        };
        Insert: {
          close_time?: string | null;
          closed?: boolean;
          created_at?: string;
          date_from: string;
          date_to?: string | null;
          id?: string;
          label: string;
          note?: string | null;
          open_time?: string | null;
        };
        Update: {
          close_time?: string | null;
          closed?: boolean;
          created_at?: string;
          date_from?: string;
          date_to?: string | null;
          id?: string;
          label?: string;
          note?: string | null;
          open_time?: string | null;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          bio: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string;
          focus_areas: Json;
          id: string;
          is_owner: boolean;
          name: string;
          photo_media_id: string | null;
          qualifications: Json;
          role_title: string | null;
          sort_order: number;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          bio?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          focus_areas?: Json;
          id?: string;
          is_owner?: boolean;
          name: string;
          photo_media_id?: string | null;
          qualifications?: Json;
          role_title?: string | null;
          sort_order?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          bio?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          focus_areas?: Json;
          id?: string;
          is_owner?: boolean;
          name?: string;
          photo_media_id?: string | null;
          qualifications?: Json;
          role_title?: string | null;
          sort_order?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_photo_media_id_fkey";
            columns: ["photo_media_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
      website_drafts: {
        Row: {
          content: Json;
          id: string;
          section_id: string;
          sort_order: number;
          updated_at: string;
          updated_by: string | null;
          visible: boolean;
        };
        Insert: {
          content: Json;
          id?: string;
          section_id: string;
          sort_order: number;
          updated_at?: string;
          updated_by?: string | null;
          visible: boolean;
        };
        Update: {
          content?: Json;
          id?: string;
          section_id?: string;
          sort_order?: number;
          updated_at?: string;
          updated_by?: string | null;
          visible?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "website_drafts_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: true;
            referencedRelation: "website_sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "website_drafts_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      website_sections: {
        Row: {
          content: Json;
          id: string;
          page: string;
          section_key: string;
          slug: string;
          sort_order: number;
          title: string;
          updated_at: string;
          updated_by: string | null;
          visible: boolean;
        };
        Insert: {
          content?: Json;
          id?: string;
          page: string;
          section_key: string;
          slug: string;
          sort_order?: number;
          title: string;
          updated_at?: string;
          updated_by?: string | null;
          visible?: boolean;
        };
        Update: {
          content?: Json;
          id?: string;
          page?: string;
          section_key?: string;
          slug?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
          visible?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "website_sections_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      page_views: {
        Row: {
          created_at: string;
          id: string;
          session_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          session_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          session_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      current_profile_role: { Args: Record<PropertyKey, never>; Returns: string };
      get_notification_email: { Args: Record<PropertyKey, never>; Returns: string | null };
      get_weekly_visitor_count: { Args: Record<PropertyKey, never>; Returns: number };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_staff: { Args: Record<PropertyKey, never>; Returns: boolean };
      prune_old_page_views: { Args: Record<PropertyKey, never>; Returns: undefined };
      publish_all_drafts: { Args: { p_actor: string }; Returns: number };
      restore_last_version: {
        Args: { p_actor: string; p_section_id: string };
        Returns: boolean;
      };
      submit_inquiry: {
        Args: {
          p_area: string;
          p_consent: boolean;
          p_email: string;
          p_first_name: string;
          p_ip_hash: string | null;
          p_last_name: string;
          p_message: string | null;
          p_phone: string | null;
          p_preferred_date: string | null;
          p_source: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database["public"];

export type Tables<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Update"];
