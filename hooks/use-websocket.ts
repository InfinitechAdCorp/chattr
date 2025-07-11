"use client"

import { useEffect, useRef, useState } from "react"
import type { Message } from "@/types"

interface WebSocketMessage {
  type: "new_message" | "user_status" | "typing" | "message_read"
  data: any
}

interface UseWebSocketProps {
  currentUserId: number
  onNewMessage: (message: Message) => void
  onUserStatusChange: (userId: number, status: "online" | "offline") => void
  onTypingUpdate: (chatId: string, userId: number, isTyping: boolean) => void
  onMessageRead: (chatId: string, messageId: number) => void
  enabled?: boolean
}

export function useWebSocket({
  currentUserId,
  onNewMessage,
  onUserStatusChange,
  onTypingUpdate,
  onMessageRead,
  enabled = false, // Disabled by default until WebSocket server is ready
}: UseWebSocketProps) {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 3 // Reduced attempts to avoid spam

  const connect = () => {
    if (!enabled) {
      setIsConnected(false)
      setIsConnecting(false)
      return
    }

    if (isConnecting || (ws.current && ws.current.readyState === WebSocket.CONNECTING)) {
      return
    }

    try {
      setIsConnecting(true)
      // In a real app, you'd get the auth token from cookies or context
      const wsUrl = `ws://localhost:8080/ws?userId=${currentUserId}`
      ws.current = new WebSocket(wsUrl)

      const connectTimeout = setTimeout(() => {
        if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
          ws.current.close()
          setIsConnecting(false)
          console.log("WebSocket connection timeout")
        }
      }, 5000) // 5 second timeout

      ws.current.onopen = () => {
        console.log("WebSocket connected")
        setIsConnected(true)
        setIsConnecting(false)
        reconnectAttempts.current = 0
        clearTimeout(connectTimeout)
      }

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)

          switch (message.type) {
            case "new_message":
              onNewMessage(message.data)
              break
            case "user_status":
              onUserStatusChange(message.data.userId, message.data.status)
              break
            case "typing":
              onTypingUpdate(message.data.chatId, message.data.userId, message.data.isTyping)
              break
            case "message_read":
              onMessageRead(message.data.chatId, message.data.messageId)
              break
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      ws.current.onclose = () => {
        console.log("WebSocket disconnected")
        setIsConnected(false)
        setIsConnecting(false)
        clearTimeout(connectTimeout)

        // Only attempt to reconnect if enabled and haven't exceeded max attempts
        if (enabled && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000) // Max 10 seconds

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`)
            connect()
          }, delay)
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.log("Max reconnection attempts reached. WebSocket disabled.")
        }
      }

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error)
        setIsConnecting(false)
        clearTimeout(connectTimeout)
      }
    } catch (error) {
      console.error("Failed to connect WebSocket:", error)
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (ws.current) {
      ws.current.close()
    }
    setIsConnected(false)
    setIsConnecting(false)
  }

  const sendMessage = (type: string, data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, data }))
      return true
    }
    return false
  }

  const sendTyping = (chatId: string, isTyping: boolean) => {
    return sendMessage("typing", { chatId, isTyping })
  }

  const markMessageAsRead = (chatId: string, messageId: number) => {
    return sendMessage("message_read", { chatId, messageId })
  }

  useEffect(() => {
    if (enabled) {
      connect()
    } else {
      disconnect()
    }
    
    return disconnect
  }, [currentUserId, enabled])

  return {
    isConnected,
    isConnecting,
    sendTyping,
    markMessageAsRead,
    reconnect: connect,
    enabled,
  }
}
