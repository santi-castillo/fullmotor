'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface BlogTagFilterProps {
  tags: string[]
}

export default function BlogTagFilter({ tags }: BlogTagFilterProps) {
  const searchParams = useSearchParams()
  const activeTag = searchParams.get('tag')

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      <Link
        href="/blog"
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          !activeTag
            ? 'bg-[var(--primary)] text-[#0b1326]'
            : 'bg-[var(--surface-highest)] text-[var(--foreground)] border border-[var(--glass-border)] hover:border-[var(--primary)]'
        }`}
      >
        Todos
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeTag === tag
              ? 'bg-[var(--primary)] text-[#0b1326]'
              : 'bg-[var(--surface-highest)] text-[var(--foreground)] border border-[var(--glass-border)] hover:border-[var(--primary)]'
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
