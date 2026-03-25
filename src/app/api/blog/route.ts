import { NextRequest, NextResponse } from 'next/server'
import { fetchBlogPosts } from '@/lib/blog'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)
  const tag = searchParams.get('tag') || undefined

  const result = await fetchBlogPosts({ page, limit, tag })

  return NextResponse.json(result)
}
