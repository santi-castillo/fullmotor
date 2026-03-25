import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { fetchBlogPostBySlug, fetchBlogPosts, getAllBlogPosts } from '@/lib/blog'
import JsonLd from '@/app/components/JsonLd'
import CommentsSection from '@/app/components/CommentsSection'
import BlogCard from '@/app/components/BlogCard'

type Params = Promise<{ slug: string }>

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

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
    <div className="fade-in">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <div className="bg-[var(--muted)] py-4">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <Link href="/" className="hover:text-[var(--foreground)]">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--foreground)]">Blog</Link>
            <span>/</span>
            <span className="text-[var(--foreground)] line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Image */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Category */}
        {post.tags[0] && (
          <span className="text-[var(--primary)] text-sm font-semibold uppercase tracking-wider">
            {post.tags[0]}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent)] mt-2 mb-4">
          {post.title}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-3 text-[var(--foreground-muted)] text-sm mb-8">
          {post.author.avatarUrl && (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <span className="font-medium text-[var(--foreground)]">{post.author.name}</span>
          <span>&middot;</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">calendar_today</span>
            {formatDate(post.publishedAt)}
          </span>
        </div>

        {/* Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[var(--border)]">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-4 py-1.5 rounded-full text-sm bg-[var(--surface-mid)] border border-[var(--surface-highest)] text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Comments */}
        <CommentsSection resourceId={slug} />

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--accent)] mb-6">
              Art&iacute;culos relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} compact />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
