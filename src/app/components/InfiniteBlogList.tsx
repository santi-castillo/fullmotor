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
      <div className="iv__empty">
        No encontramos artículos con ese tema. Probá con otro tag.
      </div>
    )
  }

  const [featured, ...rest] = posts

  return (
    <>
      <BlogCard post={featured} featured />
      {rest.length > 0 && (
        <div className="bl__grid">
          {rest.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {currentPage < lastPage && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-3 text-muted">
              <span className="tm-btn__spinner" style={{ color: 'var(--accent)' }} aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.08em]">Cargando…</span>
            </div>
          )}
        </div>
      )}
    </>
  )
}
