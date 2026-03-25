'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { BlogPost } from '@/types/blog'
import BlogCard from './BlogCard'

interface InfiniteBlogListProps {
  initialPosts: BlogPost[]
  initialMeta: { total: number; page: number; lastPage: number }
}

export default function InfiniteBlogList({ initialPosts, initialMeta }: InfiniteBlogListProps) {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState(initialPosts)
  const [currentPage, setCurrentPage] = useState(initialMeta.page)
  const [lastPage, setLastPage] = useState(initialMeta.lastPage)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const filterKey = searchParams.toString()
  const prevFilterKey = useRef(filterKey)

  useEffect(() => {
    if (prevFilterKey.current !== filterKey) {
      prevFilterKey.current = filterKey
      setPosts(initialPosts)
      setCurrentPage(initialMeta.page)
      setLastPage(initialMeta.lastPage)
    }
  }, [filterKey, initialPosts, initialMeta])

  const loadMore = useCallback(async () => {
    if (loading || currentPage >= lastPage) return

    setLoading(true)
    const nextPage = currentPage + 1

    const params = new URLSearchParams(searchParams.toString())
    params.set('page', nextPage.toString())
    params.set('limit', '12')

    try {
      const res = await fetch(`/api/blog?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data: { posts: BlogPost[]; meta: { total: number; page: number; lastPage: number } } = await res.json()

      setPosts(prev => [...prev, ...data.posts])
      setCurrentPage(data.meta.page)
      setLastPage(data.meta.lastPage)
    } catch (error) {
      console.error('Error loading more blog posts:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, currentPage, lastPage, searchParams])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-4xl text-[var(--foreground-muted)] mb-4 block">article</span>
        <p className="text-[var(--foreground-muted)]">No se encontraron art&iacute;culos</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {currentPage < lastPage && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-3 text-[var(--foreground-muted)]">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider">Cargando...</span>
            </div>
          )}
        </div>
      )}
    </>
  )
}
