"use client"

import { useEffect, useRef, useState } from "react"
import Pusher from "pusher-js"
import type { Message } from "@/types"

interface UseWebSocketProps {
  currentUserId: number
  enabled?: boolean
  onNewMessage?: (message: Message) => void
  onUserStatusChange?: (userId: number, status: "online" | "offline") => void
  onTypingUpdate?: (chatId: string, userId: number, isTyping: boolean) => void
  onMessageRead?: (chatId: string, messageId: number) => void
}

export function useWebSocket({
  currentUserId,
  enabled = true,
  onNewMessage,
  onUserStatusChange,
  onTypingUpdate,
  onMessageRead,
}: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const pusherRef = useRef<Pusher | null>(null)
  const channelsRef = useRef<Map<string, any>>(new Map())

  useEffect(() => {
    if (!enabled) return

    const connectWebSocket = async () => {
      try {
        setIsConnecting(true)

        // Get auth token for Pusher authentication
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth_token="))
          ?.split("=")[1]

        if (!token) {
          console.error("No auth token found")
          return
        }

        // Initialize Pusher
        pusherRef.current = new Pusher("local", {
          wsHost: "127.0.0.1",
          wsPort: 6001,
          wssPort: 6001,
          forceTLS: false,
          enabledTransports: ["ws", "wss"],
          auth: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          authEndpoint: "/api/broadcasting/auth",
          cluster: "mt1", // Add this line
        })

        pusherRef.current.connection.bind("connected", () => {
          console.log("WebSocket connected")
          setIsConnected(true)
          setIsConnecting(false)
        })

        pusherRef.current.connection.bind("disconnected", () => {
          console.log("WebSocket disconnected")
          setIsConnected(false)
        })

        pusherRef.current.connection.bind("error", (error: any) => {
          console.error("WebSocket error:", error)
          setIsConnecting(false)
        })
      } catch (error) {
        console.error("Failed to connect WebSocket:", error)
        setIsConnecting(false)
      }
    }

    connectWebSocket()

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect()
      }
      channelsRef.current.clear()
    }
  }, [enabled])

  const subscribeToChat = (chatId: string) => {
    if (!pusherRef.current || !isConnected) return

    const channelName = `private-chat.${chatId}`

    if (channelsRef.current.has(channelName)) {
      return // Already subscribed
    }

    const channel = pusherRef.current.subscribe(channelName)

    channel.bind("App\\Events\\MessageSent", (data: any) => {
      if (onNewMessage && data.senderId !== currentUserId) {
        onNewMessage({
          id: data.id,
          chatId: data.chatId,
          senderId: data.senderId,
          senderName: data.senderName,
          content: data.content,
          timestamp: data.timestamp,
        })
      }
    })

    channelsRef.current.set(channelName, channel)
  }

  const unsubscribeFromChat = (chatId: string) => {
    if (!pusherRef.current) return

    const channelName = `private-chat.${chatId}`
    const channel = channelsRef.current.get(channelName)

    if (channel) {
      pusherRef.current.unsubscribe(channelName)
      channelsRef.current.delete(channelName)
    }
  }

  const sendTyping = (chatId: string, isTyping: boolean) => {
    // Implement typing indicators if needed
    console.log(`User ${currentUserId} is ${isTyping ? "typing" : "stopped typing"} in chat ${chatId}`)
  }

  const markMessageAsRead = (chatId: string, messageId: number) => {
    // Implement read receipts if needed
    console.log(`Message ${messageId} read in chat ${chatId}`)
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
