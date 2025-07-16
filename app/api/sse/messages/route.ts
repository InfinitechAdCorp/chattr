import type { NextRequest } from "next/server"

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return new Response("Unauthorized", { status: 401 })
  }

  
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: "connected" })}\n\n`)

      // Set up polling to check for new messages
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`${LARAVEL_API_URL}/messages/recent`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          })

          if (response.ok) {
            const messages = await response.json()

            // Send each new message
            messages.forEach((message: any) => {
              controller.enqueue(
                `data: ${JSON.stringify({
                  type: "new_message",
                  message: {
                    id: message.id,
                    chatId: message.chat_id,
                    senderId: message.sender_id,
                    senderName: message.sender.full_name,
                    content: message.content,
                    timestamp: message.created_at,
                  },
                })}\n\n`,
              )
            })
          }
        } catch (error) {
          console.error("Error polling messages:", error)
        }
      }, 2000) // Poll every 2 seconds

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(pollInterval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
