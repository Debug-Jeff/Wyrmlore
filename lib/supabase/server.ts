import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Database } from '../database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createServerComponentClient = () =>
  createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    { cookies }
  )
