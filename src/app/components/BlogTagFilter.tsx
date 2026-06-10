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
      <Link href="/blog" className={`tm-chip flex-shrink-0${!activeTag ? ' tm-chip--active' : ''}`}>
        Todos
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className={`tm-chip flex-shrink-0${activeTag === tag ? ' tm-chip--active' : ''}`}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
