export interface BlogAuthor {
  id: string
  name: string
  avatarUrl: string | null
}

export interface BlogPost {
  id: string
  slug: string
  countryCode: string
  title: string
  excerpt: string
  coverImage: string
  author: BlogAuthor
  tags: string[]
  status?: string
  publishedAt: string
  createdAt: string
  updatedAt: string

  /** Branded content. Disclosed above the headline and on the card, never
   *  only inside the article — by then the reader has already clicked. */
  sponsored?: boolean
  sponsorName?: string
  sponsorUrl?: string
  sponsorLogoUrl?: string
  sponsorDisclosure?: string
}

export interface BlogPostDetail extends BlogPost {
  contentHtml: string
}

export interface BlogListResponse {
  data: BlogPost[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}

export interface BlogTagsResponse {
  tags: string[]
}
