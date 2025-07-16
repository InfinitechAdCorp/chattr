"use client"

import { useEffect, useRef, useState } from "react"
import type { Message } from "@/types"

interface UseSSEProps {
  currentUserId: number
  enabled?: boolean
  onNewMessage?: (message: Message) => void
  onTypingUpdate?: (chatId: string, userId: number, isTyping: boolean) => void // This line is crucial
  onMessageRead?: (chatId: string, messageId: number) => void
}

export function useSSE({ currentUserId, enabled = true, onNewMessage, onTypingUpdate, onMessageRead }: UseSSEProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const subscribedChatsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!enabled) return

    const connectSSE = () => {
      try {
        setIsConnecting(true)

        // Create EventSource connection
        eventSourceRef.current = new EventSource("/api/sse/messages", {
          withCredentials: true,
        })

        eventSourceRef.current.onopen = () => {
          console.log("SSE connected")
          setIsConnected(true)
          setIsConnecting(false)
        }

        eventSourceRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            if (data.type === "new_message" && onNewMessage) {
              // Only process messages not sent by current user
              if (data.message.senderId !== currentUserId) {
                onNewMessage(data.message)
              }
            }
            // Add other event types here if your SSE stream sends them
            if (data.type === "typing_update" && onTypingUpdate) {
              onTypingUpdate(data.chatId, data.userId, data.isTyping)
            }
            if (data.type === "message_read" && onMessageRead) {
              onMessageRead(data.chatId, data.messageId)
            }
          } catch (error) {
            console.error("Error parsing SSE message:", error)
          }
        }

        eventSourceRef.current.onerror = (error) => {
          console.error("SSE error:", error)
          setIsConnected(false)
          setIsConnecting(false)

          // Reconnect after 3 seconds
          setTimeout(() => {
            if (enabled) {
              connectSSE()
            }
          }, 3000)
        }
      } catch (error) {
        console.error("Failed to connect SSE:", error)
        setIsConnecting(false)
      }
    }

    connectSSE()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      setIsConnected(false)
      setIsConnecting(false)
    }
  }, [enabled, currentUserId, onNewMessage, onTypingUpdate, onMessageRead])

  const subscribeToChat = (chatId: string) => {
    subscribedChatsRef.current.add(chatId)
    // With SSE, the server typically pushes all relevant events to the client.
    // Explicit client-side subscriptions are less common unless the server
    // filters events based on client-sent subscription requests.
    // For this setup, the server is assumed to send all messages for the user.
  }

  const unsubscribeFromChat = (chatId: string) => {
    subscribedChatsRef.current.delete(chatId)
  }

  const sendTyping = (chatId: string, isTyping: boolean) => {
    // This would require a separate API call to the backend
    console.log(`User ${currentUserId} is ${isTyping ? "typing" : "stopped typing"} in chat ${chatId}`)
    if (onTypingUpdate) {
      onTypingUpdate(chatId, currentUserId, isTyping)
    }
  }

  const markMessageAsRead = (chatId: string, messageId: number) => {
    // This would require a separate API call to the backend
    console.log(`Message ${messageId} read in chat ${chatId}`)
    if (onMessageRead) {
      onMessageRead(chatId, messageId)
    }
  }

  return {
    isConnected,
    isConnecting,
    subscribeToChat,
    unsubscribeFromChat,
    sendTyping,
    markMessageAsRead,
  }
}
