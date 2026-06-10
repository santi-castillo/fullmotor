import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Newspaper } from 'lucide-react'
import { fetchBlogPostBySlug, fetchBlogPosts, getAllBlogPosts } from '@/lib/blog'
import { formatDate } from '@/lib/format'
import JsonLd from '@/app/components/JsonLd'
import CommentsSection from '@/app/components/CommentsSection'
import BlogCard from '@/app/components/BlogCard'
import { Badge } from '@/app/components/ui/Badge'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)
  if (!post) return { title: 'Artículo no encontrado' }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://todomotor.uy/blog/${slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: `https://todomotor.uy/blog/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Fetch related posts (exclude current)
  let relatedPosts: import('@/types/blog').BlogPost[] = []
  try {
    const { posts } = await fetchBlogPosts({ limit: 4 })
    relatedPosts = posts.filter(p => p.slug !== slug).slice(0, 3)
  } catch {
    relatedPosts = []
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: 'TodoMotor Uruguay',
      url: 'https://todomotor.uy',
    },
    mainEntityOfPage: `https://todomotor.uy/blog/${slug}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://todomotor.uy' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://todomotor.uy/blog' },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <article className="art">
        <Link href="/blog" className="art__back">
          <ArrowLeft size={16} aria-hidden="true" /> Volver al blog
        </Link>

        <div className="art__meta">
          {post.tags[0] && <Badge tone="accent">{post.tags[0]}</Badge>}
          <span className="bl__date">{formatDate(post.publishedAt)}</span>
        </div>

        <h1 className="art__title">{post.title}</h1>

        <div className="art__author">
          {post.author.avatarUrl && (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              width={32}
              height={32}
            />
          )}
          <span>{post.author.name}</span>
        </div>

        <div className="art__hero">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              priority
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Newspaper size={44} aria-hidden="true" />
          )}
        </div>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-hairline">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="tm-chip">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <CommentsSection resourceId={slug} />
      </article>

      {relatedPosts.length > 0 && (
        <section className="bl" style={{ paddingTop: 48 }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', margin: '0 0 20px' }}>
            Artículos relacionados
          </h2>
          <div className="bl__grid">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
