import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Newspaper } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { formatDate } from '@/lib/format'

interface BlogPreviewSectionProps {
  posts: BlogPost[]
}

export default function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
  if (posts.length === 0) return null

  return (
    <section className="h-sect">
      <div className="h-sect__head">
        <div>
          <h2>Blog del Motor</h2>
          <p>Contexto, impuestos y guías para comprar mejor</p>
        </div>
        <Link href="/blog" className="h-link">
          Ver todos <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="h-posts">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="h-post">
            <div className="h-post__top">
              {post.coverImage
                ? <Image src={post.coverImage} alt="" fill sizes="(max-width: 1000px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                : <Newspaper size={30} aria-hidden="true" />}
            </div>
            <div className="h-post__b">
              <span className="h-post__tag">{post.tags?.[0] || 'Blog'}</span>
              <h3 className="h-post__t">{post.title}</h3>
              <span className="h-post__d">{formatDate(post.publishedAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
