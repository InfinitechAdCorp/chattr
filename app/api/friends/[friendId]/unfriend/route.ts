import { type NextRequest, NextResponse } from "next/server"

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000/api"

export async function DELETE(request: NextRequest, { params }: { params: { friendId: string } }) {
  try {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${LARAVEL_API_URL}/friends/${params.friendId}/unfriend`, {
      method: "DELETE",
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
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
