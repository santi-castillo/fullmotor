import Link from 'next/link'
import Image from 'next/image'
import { Newspaper } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { formatDate } from '@/lib/format'

interface BlogCardProps {
  post: BlogPost
  /** Render as the large featured card (2-col, image + body) */
  featured?: boolean
}

export default function BlogCard({ post, featured }: BlogCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="bl__feat">
        <div className="bl__featimg">
          {post.coverImage
            ? <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 900px) 100vw, 55vw" style={{ objectFit: 'cover' }} />
            : <Newspaper size={52} aria-hidden="true" />}
        </div>
        <div className="bl__featb">
          <div className="bl__meta">
            {post.tags[0] && <span className="bl__tag">{post.tags[0]}</span>}
            <span className="bl__date">{formatDate(post.publishedAt)}</span>
          </div>
          <h2 className="t">{post.title}</h2>
          <p className="x">{post.excerpt}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="bl__card">
      <div className="bl__cardtop">
        {post.coverImage
          ? <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
          : <Newspaper size={30} aria-hidden="true" />}
      </div>
      <div className="bl__cardb">
        <div className="bl__meta">
          {post.tags[0] && <span className="bl__tag">{post.tags[0]}</span>}
          <span className="bl__date">{formatDate(post.publishedAt)}</span>
        </div>
        <h3 className="bl__cardt">{post.title}</h3>
        <p className="bl__cardx line-clamp-2">{post.excerpt}</p>
      </div>
    </Link>
  )
}
