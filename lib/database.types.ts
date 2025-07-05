export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          type: 'theory' | 'art' | 'discussion' | 'question' | 'news'
          author_id: string
          image_url: string | null
          tags: string[]
          votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type: 'theory' | 'art' | 'discussion' | 'question' | 'news'
          author_id: string
          image_url?: string | null
          tags?: string[]
          votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: 'theory' | 'art' | 'discussion' | 'question' | 'news'
          author_id?: string
          image_url?: string | null
          tags?: string[]
          votes?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          parent_id: string | null
          votes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          parent_id?: string | null
          votes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          parent_id?: string | null
          votes?: number
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          vote_type: 'up' | 'down'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
          vote_type: 'up' | 'down'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
          vote_type?: 'up' | 'down'
          created_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      dragon_classes: {
        Row: {
          id: string
          name: string
          description: string
          characteristics: string[]
          color_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          characteristics?: string[]
          color_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          characteristics?: string[]
          color_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dragon_species: {
        Row: {
          id: string
          name: string
          class_id: string
          description: string
          lore: string | null
          rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical'
          size_category: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'colossal'
          habitat: string[]
          diet: string
          temperament: string
          intelligence_level: 'low' | 'medium' | 'high' | 'exceptional'
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          class_id: string
          description: string
          lore?: string | null
          rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical'
          size_category: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'colossal'
          habitat?: string[]
          diet: string
          temperament: string
          intelligence_level: 'low' | 'medium' | 'high' | 'exceptional'
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          class_id?: string
          description?: string
          lore?: string | null
          rarity?: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical'
          size_category?: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'colossal'
          habitat?: string[]
          diet?: string
          temperament?: string
          intelligence_level?: 'low' | 'medium' | 'high' | 'exceptional'
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dragon_abilities: {
        Row: {
          id: string
          species_id: string
          name: string
          description: string
          ability_type: 'breath_weapon' | 'physical' | 'magical' | 'special'
          power_level: number | null
          created_at: string
        }
        Insert: {
          id?: string
          species_id: string
          name: string
          description: string
          ability_type: 'breath_weapon' | 'physical' | 'magical' | 'special'
          power_level?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          species_id?: string
          name?: string
          description?: string
          ability_type?: 'breath_weapon' | 'physical' | 'magical' | 'special'
          power_level?: number | null
          created_at?: string
        }
      }
      dragon_stats: {
        Row: {
          id: string
          species_id: string
          firepower: number | null
          speed: number | null
          armor: number | null
          stealth: number | null
          venom: number | null
          jaw_strength: number | null
          wing_span_meters: number | null
          length_meters: number | null
          weight_kg: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          species_id: string
          firepower?: number | null
          speed?: number | null
          armor?: number | null
          stealth?: number | null
          venom?: number | null
          jaw_strength?: number | null
          wing_span_meters?: number | null
          length_meters?: number | null
          weight_kg?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          species_id?: string
          firepower?: number | null
          speed?: number | null
          armor?: number | null
          stealth?: number | null
          venom?: number | null
          jaw_strength?: number | null
          wing_span_meters?: number | null
          length_meters?: number | null
          weight_kg?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      dragon_individuals: {
        Row: {
          id: string
          name: string
          species_id: string
          description: string | null
          status: 'alive' | 'deceased' | 'missing' | 'unknown'
          gender: 'male' | 'female' | 'unknown' | null
          age_category: 'hatchling' | 'juvenile' | 'adult' | 'elder' | 'ancient' | null
          rider_name: string | null
          location: string | null
          first_appearance: string | null
          special_traits: string[]
          image_url: string | null
          is_featured: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          species_id: string
          description?: string | null
          status?: 'alive' | 'deceased' | 'missing' | 'unknown'
          gender?: 'male' | 'female' | 'unknown' | null
          age_category?: 'hatchling' | 'juvenile' | 'adult' | 'elder' | 'ancient' | null
          rider_name?: string | null
          location?: string | null
          first_appearance?: string | null
          special_traits?: string[]
          image_url?: string | null
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          species_id?: string
          description?: string | null
          status?: 'alive' | 'deceased' | 'missing' | 'unknown'
          gender?: 'male' | 'female' | 'unknown' | null
          age_category?: 'hatchling' | 'juvenile' | 'adult' | 'elder' | 'ancient' | null
          rider_name?: string | null
          location?: string | null
          first_appearance?: string | null
          special_traits?: string[]
          image_url?: string | null
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      dragon_relationships: {
        Row: {
          id: string
          dragon1_id: string
          dragon2_id: string
          relationship_type: 'mate' | 'offspring' | 'sibling' | 'rival' | 'ally' | 'pack_member'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          dragon1_id: string
          dragon2_id: string
          relationship_type: 'mate' | 'offspring' | 'sibling' | 'rival' | 'ally' | 'pack_member'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          dragon1_id?: string
          dragon2_id?: string
          relationship_type?: 'mate' | 'offspring' | 'sibling' | 'rival' | 'ally' | 'pack_member'
          description?: string | null
          created_at?: string
        }
      }
      dragon_locations: {
        Row: {
          id: string
          name: string
          description: string
          location_type: 'island' | 'cave' | 'mountain' | 'forest' | 'ocean' | 'sky' | 'underground' | 'mystical'
          climate: string | null
          dangers: string[]
          notable_species: string[]
          coordinates: string | null
          image_url: string | null
          is_hidden: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          location_type: 'island' | 'cave' | 'mountain' | 'forest' | 'ocean' | 'sky' | 'underground' | 'mystical'
          climate?: string | null
          dangers?: string[]
          notable_species?: string[]
          coordinates?: string | null
          image_url?: string | null
          is_hidden?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          location_type?: 'island' | 'cave' | 'mountain' | 'forest' | 'ocean' | 'sky' | 'underground' | 'mystical'
          climate?: string | null
          dangers?: string[]
          notable_species?: string[]
          coordinates?: string | null
          image_url?: string | null
          is_hidden?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      user_dragon_favorites: {
        Row: {
          id: string
          user_id: string
          species_id: string | null
          individual_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          species_id?: string | null
          individual_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          species_id?: string | null
          individual_id?: string | null
          created_at?: string
        }
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