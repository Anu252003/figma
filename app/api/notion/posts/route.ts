import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

interface BlogPost {
  id: string
  title: string
  description: string
  url: string
  cover?: string
  createdAt: string
}

export async function GET() {
  try {
    const notionApiKey = process.env.NOTION_API_KEY
    const notionDatabaseId = process.env.NOTION_DATABASE_ID

    // If Notion is not configured, return local articles immediately
    if (!notionApiKey || !notionDatabaseId) {
      const { articles } = await import('@/lib/articles')
      const localPosts = articles.map(article => ({
        id: article.id,
        title: article.title,
        description: article.description,
        url: `/articles/${article.id}`,
        cover: article.cover,
        createdAt: article.createdAt,
      }))
      return NextResponse.json({
        posts: localPosts,
      })
    }

    const notion = new Client({
      auth: notionApiKey,
    })

    // Query the Notion database
    const response = await notion.databases.query({
      database_id: notionDatabaseId,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
      ],
    })

    // Transform Notion pages to blog posts
    const posts: BlogPost[] = response.results.map((page: any) => {
      const properties = page.properties

      // Extract title (assuming it's a title property)
      const title = properties.Title?.title?.[0]?.plain_text || 
                   properties.Name?.title?.[0]?.plain_text ||
                   properties.title?.title?.[0]?.plain_text ||
                   'Untitled'

      // Extract description (assuming it's a rich_text or text property)
      const description = properties.Description?.rich_text?.[0]?.plain_text ||
                         properties.Summary?.rich_text?.[0]?.plain_text ||
                         properties.description?.rich_text?.[0]?.plain_text ||
                         ''

      // Extract cover image
      const cover = page.cover?.external?.url || 
                   page.cover?.file?.url ||
                   null

      // Extract URL (assuming it's a url property or use the page URL)
      const url = properties.URL?.url ||
                 properties.Link?.url ||
                 page.url ||
                 '#'

      // Extract created date
      const createdAt = properties.Created?.created_time ||
                       properties.Date?.date?.start ||
                       page.created_time ||
                       new Date().toISOString()

      return {
        id: page.id,
        title,
        description,
        url,
        cover,
        createdAt,
      }
    })

    // If no posts found, return articles from our local articles
    if (posts.length === 0) {
      const { articles } = await import('@/lib/articles')
      const localPosts = articles.map(article => ({
        id: article.id,
        title: article.title,
        description: article.description,
        url: `/articles/${article.id}`,
        cover: article.cover,
        createdAt: article.createdAt,
      }))
      return NextResponse.json({
        posts: localPosts,
      })
    }

    return NextResponse.json({
      posts: posts.slice(0, 6), // Limit to 6 posts
    })
  } catch (error: any) {
    console.error('Error fetching Notion posts:', error)
    
    // Return articles from our local articles if Notion API fails
    const { articles } = await import('@/lib/articles')
    const localPosts = articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      url: `/articles/${article.id}`,
      cover: article.cover,
      createdAt: article.createdAt,
    }))
    return NextResponse.json({
      posts: localPosts,
      error: error.message,
    })
  }
}

