export interface ArticlePage {
  id: string
  title: string
  content: string
  order: number
}

export interface Article {
  id: string
  title: string
  description: string
  content: string
  pages?: ArticlePage[]
  author: string
  cover?: string
  createdAt: string
  readTime: string
  category: string
  tags: string[]
}

