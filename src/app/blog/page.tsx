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
    <div className="bl" style={{ paddingBottom: 24 }}>
      <JsonLd data={blogJsonLd} />

      <div className="bl__head">
        <span className="bl__kicker">Blog del Motor</span>
        <h1 className="bl__title">Contexto para comprar mejor</h1>
        <p className="bl__sub">Impuestos, normativa y guías del mercado automotor uruguayo.</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Suspense fallback={<div className="h-10" />}>
          <BlogTagFilter tags={tags} />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <InfiniteBlogList initialPosts={posts} initialMeta={meta} />
      </Suspense>
    </div>
  )
}
