import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/types/blog'

interface BlogCardProps {
  post: BlogPost
  compact?: boolean
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BlogCard({ post, compact }: BlogCardProps) {
  if (compact) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="bg-[var(--surface-mid)] rounded-xl overflow-hidden border border-[var(--glass-border)] hover:border-[rgba(0,220,229,0.3)] transition-all">
          {post.coverImage && (
            <div className="relative h-44 w-full">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          )}
          <div className="p-4">
            {post.tags[0] && (
              <span className="inline-block bg-[var(--surface-highest)] text-[var(--primary)] text-xs font-semibold px-3 py-1 rounded-full mb-2">
                {post.tags[0]}
              </span>
            )}
            <h3 className="text-base font-bold text-[var(--accent)] group-hover:text-[var(--primary-light)] transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-[var(--foreground-muted)] text-xs mt-2">
              {formatDate(post.publishedAt)}
            </p>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-[var(--surface-mid)] rounded-xl overflow-hidden border border-[var(--glass-border)] hover:border-[rgba(0,220,229,0.3)] transition-all">
        <div className="flex flex-col md:flex-row">
          {post.coverImage && (
            <div className="relative h-48 md:h-auto md:w-[280px] flex-shrink-0">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 280px"
              />
            </div>
          )}
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
            <div>
              {post.tags[0] && (
                <span className="inline-block bg-[var(--surface-highest)] text-[var(--primary)] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {post.tags[0]}
                </span>
              )}
              <h3 className="text-xl md:text-2xl font-bold text-[var(--accent)] group-hover:text-[var(--primary-light)] transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>
              <p className="text-[var(--foreground-muted)] text-sm line-clamp-2">
                {post.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                {post.author.avatarUrl && (
                  <Image
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>{post.author.name}</span>
                <span>&middot;</span>
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <span className="flex items-center gap-1 text-[var(--primary)] text-sm font-semibold group-hover:gap-2 transition-all">
                Leer m&aacute;s
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
