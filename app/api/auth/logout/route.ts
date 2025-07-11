import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "http://localhost:8000/api"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (token) {
      await fetch(`${LARAVEL_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
    }

    const response = NextResponse.json({ message: "Logged out successfully" })
    response.cookies.delete("auth_token")

    return response
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
