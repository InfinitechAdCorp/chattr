import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000/api"

// GET handler for fetching messages (existing)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - token missing" }, { status: 401 })
    }

    const response = await fetch(`${LARAVEL_API_URL}/messages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Message fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST handler for sending new messages (NEW)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - token missing" }, { status: 401 })
    }

    const { chatId, content } = await request.json()

    if (!chatId || !content) {
      return NextResponse.json({ error: "Missing chatId or content" }, { status: 400 })
    }

    // Forward the message to your Laravel backend
    const response = await fetch(`${LARAVEL_API_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ chatId: chatId, content }), // Ensure Laravel expects chat_id
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Failed to send message to Laravel:", data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
