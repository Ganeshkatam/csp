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
      admin_users: {
        Row: {
          created_at: string
          email: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          category: string
          created_at: string
          description: string
          description_te: string | null
          event_date: string | null
          id: string
          image_url: string | null
          source: string
          status: string
          title: string
          title_te: string | null
          updated_at: string
          verified_on: string
          village_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          description_te?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          source: string
          status?: string
          title: string
          title_te?: string | null
          updated_at?: string
          verified_on: string
          village_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          description_te?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          source?: string
          status?: string
          title?: string
          title_te?: string | null
          updated_at?: string
          verified_on?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          address_status: string | null
          address_verified: boolean | null
          category: string
          created_at: string
          district: string | null
          id: string
          image_url: string | null
          landmark: string | null
          locality: string | null
          mandal: string | null
          name: string
          name_te: string | null
          owner_name: string | null
          phone: string | null
          phone_verified: boolean | null
          pin: string | null
          services: string | null
          services_te: string | null
          source: string
          state: string | null
          status: string
          updated_at: string
          verification_method: string | null
          verified_on: string
          village_id: string
        }
        Insert: {
          address?: string | null
          address_status?: string | null
          address_verified?: boolean | null
          category: string
          created_at?: string
          district?: string | null
          id?: string
          image_url?: string | null
          landmark?: string | null
          locality?: string | null
          mandal?: string | null
          name: string
          name_te?: string | null
          owner_name?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          pin?: string | null
          services?: string | null
          services_te?: string | null
          source: string
          state?: string | null
          status?: string
          updated_at?: string
          verification_method?: string | null
          verified_on: string
          village_id: string
        }
        Update: {
          address?: string | null
          address_status?: string | null
          address_verified?: boolean | null
          category?: string
          created_at?: string
          district?: string | null
          id?: string
          image_url?: string | null
          landmark?: string | null
          locality?: string | null
          mandal?: string | null
          name?: string
          name_te?: string | null
          owner_name?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          pin?: string | null
          services?: string | null
          services_te?: string | null
          source?: string
          state?: string | null
          status?: string
          updated_at?: string
          verification_method?: string | null
          verified_on?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      citizen_feedback: {
        Row: {
          created_at: string
          feedback_type: string
          id: string
          message: string
          name: string | null
          phone: string | null
          reference_id: string | null
          status: string
          village_id: string
        }
        Insert: {
          created_at?: string
          feedback_type?: string
          id?: string
          message: string
          name?: string | null
          phone?: string | null
          reference_id?: string | null
          status?: string
          village_id: string
        }
        Update: {
          created_at?: string
          feedback_type?: string
          id?: string
          message?: string
          name?: string | null
          phone?: string | null
          reference_id?: string | null
          status?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "citizen_feedback_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_schedules: {
        Row: {
          created_at: string
          days_active: string
          days_active_te: string | null
          display_order: number | null
          doctor_name: string | null
          doctor_role: string
          doctor_role_te: string | null
          facility_name: string
          id: string
          room_or_desk: string
          room_or_desk_te: string | null
          services_offered: string | null
          services_offered_te: string | null
          source: string
          status: string
          timings: string
          timings_te: string | null
          updated_at: string
          verified_on: string
          village_id: string
        }
        Insert: {
          created_at?: string
          days_active: string
          days_active_te?: string | null
          display_order?: number | null
          doctor_name?: string | null
          doctor_role: string
          doctor_role_te?: string | null
          facility_name: string
          id?: string
          room_or_desk: string
          room_or_desk_te?: string | null
          services_offered?: string | null
          services_offered_te?: string | null
          source?: string
          status?: string
          timings: string
          timings_te?: string | null
          updated_at?: string
          verified_on?: string
          village_id: string
        }
        Update: {
          created_at?: string
          days_active?: string
          days_active_te?: string | null
          display_order?: number | null
          doctor_name?: string | null
          doctor_role?: string
          doctor_role_te?: string | null
          facility_name?: string
          id?: string
          room_or_desk?: string
          room_or_desk_te?: string | null
          services_offered?: string | null
          services_offered_te?: string | null
          source?: string
          status?: string
          timings?: string
          timings_te?: string | null
          updated_at?: string
          verified_on?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_schedules_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          address_status: string | null
          address_verified: boolean | null
          availability: string | null
          category: string
          created_at: string
          designation: string | null
          designation_te: string | null
          district: string | null
          id: string
          jurisdiction: string | null
          landmark: string | null
          locality: string | null
          mandal: string | null
          name: string
          name_te: string | null
          phone: string | null
          phone_verified: boolean | null
          pin: string | null
          source: string
          state: string | null
          status: string
          updated_at: string
          verification_method: string | null
          verified_on: string
          village_id: string
        }
        Insert: {
          address?: string | null
          address_status?: string | null
          address_verified?: boolean | null
          availability?: string | null
          category: string
          created_at?: string
          designation?: string | null
          designation_te?: string | null
          district?: string | null
          id?: string
          jurisdiction?: string | null
          landmark?: string | null
          locality?: string | null
          mandal?: string | null
          name: string
          name_te?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          pin?: string | null
          source: string
          state?: string | null
          status?: string
          updated_at?: string
          verification_method?: string | null
          verified_on: string
          village_id: string
        }
        Update: {
          address?: string | null
          address_status?: string | null
          address_verified?: boolean | null
          availability?: string | null
          category?: string
          created_at?: string
          designation?: string | null
          designation_te?: string | null
          district?: string | null
          id?: string
          jurisdiction?: string | null
          landmark?: string | null
          locality?: string | null
          mandal?: string | null
          name?: string
          name_te?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          pin?: string | null
          source?: string
          state?: string | null
          status?: string
          updated_at?: string
          verification_method?: string | null
          verified_on?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_services: {
        Row: {
          availability: string
          availability_te: string | null
          category: string
          category_te: string | null
          created_at: string
          display_order: number | null
          fee: string
          fee_te: string | null
          id: string
          prerequisites: string | null
          prerequisites_te: string | null
          sample_type: string
          sample_type_te: string | null
          source: string
          status: string
          test_name: string
          test_name_te: string | null
          turnaround_time: string
          turnaround_time_te: string | null
          updated_at: string
          verified_on: string
          village_id: string
        }
        Insert: {
          availability?: string
          availability_te?: string | null
          category: string
          category_te?: string | null
          created_at?: string
          display_order?: number | null
          fee?: string
          fee_te?: string | null
          id?: string
          prerequisites?: string | null
          prerequisites_te?: string | null
          sample_type: string
          sample_type_te?: string | null
          source?: string
          status?: string
          test_name: string
          test_name_te?: string | null
          turnaround_time: string
          turnaround_time_te?: string | null
          updated_at?: string
          verified_on?: string
          village_id: string
        }
        Update: {
          availability?: string
          availability_te?: string | null
          category?: string
          category_te?: string | null
          created_at?: string
          display_order?: number | null
          fee?: string
          fee_te?: string | null
          id?: string
          prerequisites?: string | null
          prerequisites_te?: string | null
          sample_type?: string
          sample_type_te?: string | null
          source?: string
          status?: string
          test_name?: string
          test_name_te?: string | null
          turnaround_time?: string
          turnaround_time_te?: string | null
          updated_at?: string
          verified_on?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_services_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      immunization_schedules: {
        Row: {
          created_at: string
          display_order: number | null
          frequency_or_date: string
          frequency_or_date_te: string | null
          id: string
          session_name: string
          session_name_te: string | null
          source: string
          status: string
          supervising_worker: string
          supervising_worker_te: string | null
          target_cohort: string
          target_cohort_te: string | null
          timings: string
          timings_te: string | null
          updated_at: string
          vaccines_administered: string
          venue: string
          venue_te: string | null
          verified_on: string
          village_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          frequency_or_date: string
          frequency_or_date_te?: string | null
          id?: string
          session_name: string
          session_name_te?: string | null
          source?: string
          status?: string
          supervising_worker: string
          supervising_worker_te?: string | null
          target_cohort: string
          target_cohort_te?: string | null
          timings: string
          timings_te?: string | null
          updated_at?: string
          vaccines_administered: string
          venue: string
          venue_te?: string | null
          verified_on?: string
          village_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          frequency_or_date?: string
          frequency_or_date_te?: string | null
          id?: string
          session_name?: string
          session_name_te?: string | null
          source?: string
          status?: string
          supervising_worker?: string
          supervising_worker_te?: string | null
          target_cohort?: string
          target_cohort_te?: string | null
          timings?: string
          timings_te?: string | null
          updated_at?: string
          vaccines_administered?: string
          venue?: string
          venue_te?: string | null
          verified_on?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "immunization_schedules_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          address: string | null
          address_status: string | null
          address_verified: boolean | null
          created_at: string
          district: string | null
          id: string
          image_url: string | null
          landmark: string | null
          locality: string | null
          mandal: string | null
          name: string
          name_te: string | null
          phone: string | null
          phone_verified: boolean | null
          pin: string | null
          services: string | null
          services_te: string | null
          source: string
          state: string | null
          status: string
          timings: string | null
          type: string
          updated_at: string
          verification_method: string | null
          verified_on: string
          village_id: string
        }
        Insert: {
          address?: string | null
          address_status?: string | null
          address_verified?: boolean | null
          created_at?: string
          district?: string | null
          id?: string
          image_url?: string | null
          landmark?: string | null
          locality?: string | null
          mandal?: string | null
          name: string
          name_te?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          pin?: string | null
          services?: string | null
          services_te?: string | null
          source: string
          state?: string | null
          status?: string
          timings?: string | null
          type: string
          updated_at?: string
          verification_method?: string | null
          verified_on: string
          village_id: string
        }
        Update: {
          address?: string | null
          address_status?: string | null
          address_verified?: boolean | null
          created_at?: string
          district?: string | null
          id?: string
          image_url?: string | null
          landmark?: string | null
          locality?: string | null
          mandal?: string | null
          name?: string
          name_te?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          pin?: string | null
          services?: string | null
          services_te?: string | null
          source?: string
          state?: string | null
          status?: string
          timings?: string | null
          type?: string
          updated_at?: string
          verification_method?: string | null
          verified_on?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "institutions_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      schemes: {
        Row: {
          application_process: string | null
          benefits: string | null
          category: string
          created_at: string
          department: string | null
          description: string
          description_te: string | null
          documents: string
          documents_te: string | null
          eligibility: string
          eligibility_te: string | null
          exclusions: string | null
          id: string
          image_url: string | null
          name: string
          name_te: string | null
          official_url: string
          source: string
          status: string
          updated_at: string
          verified_on: string
          village_id: string
        }
        Insert: {
          application_process?: string | null
          benefits?: string | null
          category: string
          created_at?: string
          department?: string | null
          description: string
          description_te?: string | null
          documents: string
          documents_te?: string | null
          eligibility: string
          eligibility_te?: string | null
          exclusions?: string | null
          id?: string
          image_url?: string | null
          name: string
          name_te?: string | null
          official_url: string
          source: string
          status?: string
          updated_at?: string
          verified_on: string
          village_id: string
        }
        Update: {
          application_process?: string | null
          benefits?: string | null
          category?: string
          created_at?: string
          department?: string | null
          description?: string
          description_te?: string | null
          documents?: string
          documents_te?: string | null
          eligibility?: string
          eligibility_te?: string | null
          exclusions?: string | null
          id?: string
          image_url?: string | null
          name?: string
          name_te?: string | null
          official_url?: string
          source?: string
          status?: string
          updated_at?: string
          verified_on?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schemes_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      village_localities: {
        Row: {
          created_at: string
          id: string
          locality_name: string
          source: string
          status: string
          verification_method: string | null
          verified_on: string
          village_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          locality_name: string
          source?: string
          status?: string
          verification_method?: string | null
          verified_on?: string
          village_id: string
        }
        Update: {
          created_at?: string
          id?: string
          locality_name?: string
          source?: string
          status?: string
          verification_method?: string | null
          verified_on?: string
          village_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "village_localities_village_id_fkey"
            columns: ["village_id"]
            isOneToOne: false
            referencedRelation: "villages"
            referencedColumns: ["id"]
          },
        ]
      }
      villages: {
        Row: {
          branch_post_office: string | null
          census_village_code: string | null
          created_at: string
          description: string | null
          district: string
          electricity_helpline: string | null
          gram_panchayat: string
          id: string
          mandal: string
          name: string
          pin: string | null
          postal_division: string | null
          power_utility: string | null
          source: string
          state: string
          sub_post_office: string | null
          updated_at: string
          verified_on: string
        }
        Insert: {
          branch_post_office?: string | null
          census_village_code?: string | null
          created_at?: string
          description?: string | null
          district: string
          electricity_helpline?: string | null
          gram_panchayat: string
          id?: string
          mandal: string
          name: string
          pin?: string | null
          postal_division?: string | null
          power_utility?: string | null
          source: string
          state: string
          sub_post_office?: string | null
          updated_at?: string
          verified_on: string
        }
        Update: {
          branch_post_office?: string | null
          census_village_code?: string | null
          created_at?: string
          description?: string | null
          district?: string
          electricity_helpline?: string | null
          gram_panchayat?: string
          id?: string
          mandal?: string
          name?: string
          pin?: string | null
          postal_division?: string | null
          power_utility?: string | null
          source?: string
          state?: string
          sub_post_office?: string | null
          updated_at?: string
          verified_on?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
