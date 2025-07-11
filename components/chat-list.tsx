"use client"

import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { Chat } from "@/types"

interface ChatListProps {
  chats: Chat[]
  selectedChat: Chat | null
  onSelectChat: (chat: Chat) => void
  searchQuery: string
  typingUsers?: Record<string, number[]>
}

export function ChatList({ chats, selectedChat, onSelectChat, searchQuery, typingUsers = {} }: ChatListProps) {
  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-center">{searchQuery ? "No chats match your search" : "No conversations yet"}</p>
        <p className="text-sm text-center mt-1">
          {searchQuery ? "Try a different search term" : "Start a conversation with friends or create a group"}
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {chats.map((chat) => {
        const isSelected = selectedChat?.id === chat.id
        const isTyping = typingUsers[chat.id] && typingUsers[chat.id].length > 0
        const hasUnread = chat.unreadCount > 0

        return (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
              isSelected
                ? "bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500"
                : hasUnread
                  ? "bg-blue-25 dark:bg-blue-950/10"
                  : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    chat.type === "group"
                      ? "bg-gradient-to-br from-purple-500 to-pink-500"
                      : "bg-gradient-to-br from-blue-500 to-cyan-500"
                  }`}
                >
                  {chat.type === "group" ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  ) : (
                    chat.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Online indicator for direct chats */}
                {chat.type === "direct" && chat.participant?.status === "online" && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
                )}

                {/* Unread indicator */}
                {hasUnread && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-semibold truncate ${
                      hasUnread ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {chat.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {hasUnread && (
                      <Badge className="bg-red-500 text-white border-0 shadow-lg shadow-red-500/25 animate-pulse font-bold text-xs min-w-[20px] h-5">
                        {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm truncate ${
                      isTyping
                        ? "text-blue-500 dark:text-blue-400 italic animate-pulse"
                        : hasUnread
                          ? "text-gray-900 dark:text-gray-200 font-medium"
                          : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {isTyping ? (
                      <span className="flex items-center">
                        <span className="flex space-x-1 mr-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </span>
                        {typingUsers[chat.id]?.length === 1 ? "Someone is typing..." : "Multiple people are typing..."}
                      </span>
                    ) : (
                      chat.lastMessage || "No messages yet"
                    )}
                  </p>

                  {/* Message status indicators */}
                  <div className="flex items-center space-x-1">
                    {chat.type === "direct" && chat.participant?.status === "online" && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Online"></div>
                    )}
                    {hasUnread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="New messages"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
