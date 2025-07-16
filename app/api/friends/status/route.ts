import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000/api"

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        return response
      } else if (response.status >= 500) {
        // Retry on server errors
        console.warn(`Attempt ${i + 1} failed for ${url} with status ${response.status}. Retrying...`)
        await new Promise((res) => setTimeout(res, delay * (i + 1))) // Exponential backoff
      } else {
        // For client errors (4xx), don't retry, just return the response
        return response
      }
    } catch (error: any) {
      console.warn(`Attempt ${i + 1} failed for ${url} with error: ${error.message}. Retrying...`)
      if (error.cause && error.cause.code) {
        console.warn(`Fetch failed due to: ${error.cause.code}`)
      }
      await new Promise((res) => setTimeout(res, delay * (i + 1))) // Exponential backoff
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts.`)
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  if (!token) {
    console.error("API/friends/status: Unauthorized - token missing")
    return NextResponse.json({ error: "Unauthorized - token missing" }, { status: 401 })
  }

  const targetUrl = `${LARAVEL_API_URL}/friends/status`
  console.log(`API/friends/status: Attempting to fetch from Laravel: ${targetUrl}`)

  try {
    const response = await fetchWithRetry(targetUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`API/friends/status: Laravel responded with status ${response.status}:`, data)
      return NextResponse.json(data, { status: response.status })
    }

    console.log("API/friends/status: Successfully fetched friend statuses.")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("API/friends/status: Error fetching friend statuses from Laravel:", error)
    return NextResponse.json({ error: "Internal server error or connection refused" }, { status: 500 })
  }
}
