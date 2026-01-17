import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get('state')
  const city = searchParams.get('city')
  const name = searchParams.get('name')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('enrolled_agents')
    .select('*', { count: 'exact' })

  // Filter by state
  if (state && state !== 'all') {
    query = query.eq('state', state.toUpperCase())
  }

  // Filter by city
  if (city) {
    query = query.ilike('city', `%${city}%`)
  }

  // Filter by name
  if (name) {
    query = query.or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`)
  }

  // Only US-based EAs
  query = query.eq('country', 'United States')

  // Order and paginate
  query = query
    .order('featured', { ascending: false })
    .order('last_name', { ascending: true })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    agents: data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  })
}