import { type NextRequest } from 'next/server'

export const runtime = "edge";

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const title = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json', {
    next: {
      revalidate: 600
    }
  })
    .then(response => response.json())
    .then(async storyIds => {
      const randomIdx = Math.floor(Math.random() * storyIds.length);
      const storyId = storyIds[randomIdx];
      console.log({ storyId })
      return fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
        .then(response => response.json())
        .then(story => {
          return (story.title) as string;
        })
    })
  return new Response(
    JSON.stringify({ title }), {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=59',
      // 'CDN-Cache-Control': 'public, s-maxage=60',
      // 'Vercel-CDN-Cache-Control': 'public, s-maxage=60',
    }
  })
}

