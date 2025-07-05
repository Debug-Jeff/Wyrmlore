import { supabase } from './supabase/client'
import { Database } from './database.types'

export type DragonClass = Database['public']['Tables']['dragon_classes']['Row']
export type DragonSpecies = Database['public']['Tables']['dragon_species']['Row'] & {
  dragon_class: DragonClass
  abilities: DragonAbility[]
  stats: DragonStats | null
  is_favorited?: boolean
}
export type DragonAbility = Database['public']['Tables']['dragon_abilities']['Row']
export type DragonStats = Database['public']['Tables']['dragon_stats']['Row']
export type DragonIndividual = Database['public']['Tables']['dragon_individuals']['Row'] & {
  species: DragonSpecies
  relationships?: DragonRelationship[]
  is_favorited?: boolean
}
export type DragonRelationship = Database['public']['Tables']['dragon_relationships']['Row'] & {
  related_dragon: DragonIndividual
}
export type DragonLocation = Database['public']['Tables']['dragon_locations']['Row']

export class DragonService {
  // Dragon Classes
  static async getDragonClasses(): Promise<DragonClass[]> {
    const { data, error } = await supabase
      .from('dragon_classes')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  // Dragon Species
  static async getDragonSpecies(options: {
    classId?: string
    rarity?: string
    search?: string
    userId?: string
  } = {}): Promise<DragonSpecies[]> {
    const { classId, rarity, search, userId } = options

    let query = supabase
      .from('dragon_species')
      .select(`
        *,
        dragon_class:dragon_classes!dragon_species_class_id_fkey(*),
        abilities:dragon_abilities(*),
        stats:dragon_stats(*)
      `)
      .order('name')

    if (classId) {
      query = query.eq('class_id', classId)
    }

    if (rarity) {
      query = query.eq('rarity', rarity)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: species, error } = await query

    if (error) throw error

    if (!species) return []

    // Get user favorites if userId provided
    if (userId) {
      const speciesIds = species.map(s => s.id)
      const { data: favorites } = await supabase
        .from('user_dragon_favorites')
        .select('species_id')
        .eq('user_id', userId)
        .in('species_id', speciesIds)

      const favoriteIds = new Set(favorites?.map(f => f.species_id) || [])
      
      return species.map(s => ({
        ...s,
        stats: s.stats?.[0] || null,
        is_favorited: favoriteIds.has(s.id)
      }))
    }

    return species.map(s => ({
      ...s,
      stats: s.stats?.[0] || null
    }))
  }

  static async getDragonSpeciesById(id: string, userId?: string): Promise<DragonSpecies | null> {
    const { data: species, error } = await supabase
      .from('dragon_species')
      .select(`
        *,
        dragon_class:dragon_classes!dragon_species_class_id_fkey(*),
        abilities:dragon_abilities(*),
        stats:dragon_stats(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (!species) return null

    // Check if favorited by user
    let isFavorited = false
    if (userId) {
      const { data: favorite } = await supabase
        .from('user_dragon_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('species_id', id)
        .single()

      isFavorited = !!favorite
    }

    return {
      ...species,
      stats: species.stats?.[0] || null,
      is_favorited: isFavorited
    }
  }

  // Dragon Individuals
  static async getDragonIndividuals(options: {
    featured?: boolean
    speciesId?: string
    search?: string
    userId?: string
  } = {}): Promise<DragonIndividual[]> {
    const { featured, speciesId, search, userId } = options

    let query = supabase
      .from('dragon_individuals')
      .select(`
        *,
        species:dragon_species!dragon_individuals_species_id_fkey(
          *,
          dragon_class:dragon_classes!dragon_species_class_id_fkey(*),
          abilities:dragon_abilities(*),
          stats:dragon_stats(*)
        )
      `)
      .order('name')

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (speciesId) {
      query = query.eq('species_id', speciesId)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: individuals, error } = await query

    if (error) throw error

    if (!individuals) return []

    // Get user favorites if userId provided
    if (userId) {
      const individualIds = individuals.map(i => i.id)
      const { data: favorites } = await supabase
        .from('user_dragon_favorites')
        .select('individual_id')
        .eq('user_id', userId)
        .in('individual_id', individualIds)

      const favoriteIds = new Set(favorites?.map(f => f.individual_id) || [])
      
      return individuals.map(i => ({
        ...i,
        species: {
          ...i.species,
          stats: i.species.stats?.[0] || null
        },
        is_favorited: favoriteIds.has(i.id)
      }))
    }

    return individuals.map(i => ({
      ...i,
      species: {
        ...i.species,
        stats: i.species.stats?.[0] || null
      }
    }))
  }

  static async getDragonIndividualById(id: string, userId?: string): Promise<DragonIndividual | null> {
    const { data: individual, error } = await supabase
      .from('dragon_individuals')
      .select(`
        *,
        species:dragon_species!dragon_individuals_species_id_fkey(
          *,
          dragon_class:dragon_classes!dragon_species_class_id_fkey(*),
          abilities:dragon_abilities(*),
          stats:dragon_stats(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    if (!individual) return null

    // Get relationships
    const { data: relationships } = await supabase
      .from('dragon_relationships')
      .select(`
        *,
        related_dragon:dragon_individuals!dragon_relationships_dragon2_id_fkey(
          *,
          species:dragon_species!dragon_individuals_species_id_fkey(*)
        )
      `)
      .eq('dragon1_id', id)

    // Check if favorited by user
    let isFavorited = false
    if (userId) {
      const { data: favorite } = await supabase
        .from('user_dragon_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('individual_id', id)
        .single()

      isFavorited = !!favorite
    }

    return {
      ...individual,
      species: {
        ...individual.species,
        stats: individual.species.stats?.[0] || null
      },
      relationships: relationships || [],
      is_favorited: isFavorited
    }
  }

  // Dragon Locations
  static async getDragonLocations(): Promise<DragonLocation[]> {
    const { data, error } = await supabase
      .from('dragon_locations')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  static async getDragonLocationById(id: string): Promise<DragonLocation | null> {
    const { data, error } = await supabase
      .from('dragon_locations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // User Favorites
  static async toggleFavorite(userId: string, speciesId?: string, individualId?: string) {
    if (!speciesId && !individualId) {
      throw new Error('Either speciesId or individualId must be provided')
    }

    // Check if already favorited
    let query = supabase
      .from('user_dragon_favorites')
      .select('id')
      .eq('user_id', userId)

    if (speciesId) {
      query = query.eq('species_id', speciesId)
    } else {
      query = query.eq('individual_id', individualId)
    }

    const { data: existing } = await query.single()

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('user_dragon_favorites')
        .delete()
        .eq('id', existing.id)

      if (error) throw error
      return { favorited: false }
    } else {
      // Add favorite
      const { error } = await supabase
        .from('user_dragon_favorites')
        .insert({
          user_id: userId,
          species_id: speciesId || null,
          individual_id: individualId || null
        })

      if (error) throw error
      return { favorited: true }
    }
  }

  static async getUserFavorites(userId: string) {
    const { data: favorites, error } = await supabase
      .from('user_dragon_favorites')
      .select(`
        *,
        species:dragon_species!user_dragon_favorites_species_id_fkey(
          *,
          dragon_class:dragon_classes!dragon_species_class_id_fkey(*),
          stats:dragon_stats(*)
        ),
        individual:dragon_individuals!user_dragon_favorites_individual_id_fkey(
          *,
          species:dragon_species!dragon_individuals_species_id_fkey(
            *,
            dragon_class:dragon_classes!dragon_species_class_id_fkey(*)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      species: favorites?.filter(f => f.species).map(f => ({
        ...f.species,
        stats: f.species.stats?.[0] || null
      })) || [],
      individuals: favorites?.filter(f => f.individual).map(f => f.individual) || []
    }
  }

  // Search
  static async searchDragons(query: string, userId?: string) {
    const [species, individuals] = await Promise.all([
      this.getDragonSpecies({ search: query, userId }),
      this.getDragonIndividuals({ search: query, userId })
    ])

    return { species, individuals }
  }
}