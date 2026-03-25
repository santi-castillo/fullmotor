import Link from 'next/link'
import { BlogPost } from '@/types/blog'
import BlogCard from './BlogCard'

interface BlogPreviewSectionProps {
  posts: BlogPost[]
}

export default function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
  if (posts.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--primary)]">
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-[var(--accent)] mt-1">
            Blog del Motor
          </h2>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-1 text-[var(--primary)] text-sm font-semibold hover:gap-2 transition-all"
        >
          Ver todos
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} compact />
        ))}
      </div>
    </section>
  )
}
