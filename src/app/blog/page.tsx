import { Suspense } from 'react'
import { Metadata } from 'next'
import { fetchBlogPosts, fetchBlogTags } from '@/lib/blog'
import BlogTagFilter from '@/app/components/BlogTagFilter'
import InfiniteBlogList from '@/app/components/InfiniteBlogList'
import JsonLd from '@/app/components/JsonLd'

export const metadata: Metadata = {
  title: 'Blog del Motor',
  description: 'Las últimas tendencias, lanzamientos y noticias del mundo automotor en Uruguay.',
  openGraph: {
    title: 'Blog del Motor | TodoMotor Uruguay',
    description: 'Las últimas tendencias, lanzamientos y noticias del mundo automotor en Uruguay.',
    type: 'website',
    url: 'https://todomotor.uy/blog',
  },
  alternates: {
    canonical: 'https://todomotor.uy/blog',
  },
}

interface PageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const tag = params.tag || undefined

  const [{ posts, meta }, tags] = await Promise.all([
    fetchBlogPosts({ page: 1, limit: 12, tag }),
    fetchBlogTags(),
  ])

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog del Motor - TodoMotor Uruguay',
    url: 'https://todomotor.uy/blog',
    description: 'Las últimas tendencias, lanzamientos y noticias del mundo automotor en Uruguay.',
  }

  return (
    <div className="fade-in">
      <JsonLd data={blogJsonLd} />

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-2">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--primary)]">
          Blog
        </span>
        <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-[var(--accent)] mt-1">
          Blog del Motor
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm mt-2">
          &Uacute;ltimas tendencias y potencia pura
        </p>
      </section>

      {/* Tags + Posts */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <Suspense fallback={<div className="h-10 bg-[var(--muted)] rounded-lg animate-pulse" />}>
          <BlogTagFilter tags={tags} />
        </Suspense>

        <div className="mt-8">
          <Suspense fallback={null}>
            <InfiniteBlogList initialPosts={posts} initialMeta={meta} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
