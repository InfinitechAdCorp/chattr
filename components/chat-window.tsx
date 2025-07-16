"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Send, Smile, Paperclip, Phone, Video, MoreVertical, Users } from "lucide-react"
import { GroupMembersModal } from "@/components/group-members-modal"
import type { ChatWindowProps } from "@/types"
import { FriendOptionsModal } from "@/components/friend-options-modal"

export function ChatWindow({
  chat,
  messages,
  currentUser,
  onSendMessage,
  onBack,
  isMobile = false,
  onTyping,
  typingUsers = [],
  onUnfriend,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showGroupMembers, setShowGroupMembers] = useState(false)
  const [showFriendOptions, setShowFriendOptions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle typing indicator
  useEffect(() => {
    if (onTyping) {
      if (newMessage.trim() && !isTyping) {
        setIsTyping(true)
        onTyping(true)
      } else if (!newMessage.trim() && isTyping) {
        setIsTyping(false)
        onTyping(false)
      }

      // Clear typing after 3 seconds of inactivity
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      if (newMessage.trim()) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false)
          onTyping(false)
        }, 3000)
      }
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [newMessage, isTyping, onTyping])

  // Stop typing when component unmounts
  useEffect(() => {
    return () => {
      if (onTyping && isTyping) {
        onTyping(false)
      }
    }
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageContent = newMessage.trim()
    setNewMessage("")

    // Stop typing indicator
    if (onTyping && isTyping) {
      setIsTyping(false)
      onTyping(false)
    }

    try {
      await onSendMessage(messageContent)
    } catch (error) {
      console.error("Failed to send message:", error)
      // Optionally restore the message on error
      setNewMessage(messageContent)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const getChatTitle = () => {
    if (chat.type === "group") {
      return chat.name
    }
    return chat.participant?.full_name || chat.name
  }

  const getChatSubtitle = () => {
    if (chat.type === "group") {
      const memberCount = chat.group?.members?.length || 0
      return `${memberCount} members`
    }
    return chat.participant?.status === "online" ? "Online" : "Last seen recently"
  }

  const getTypingText = () => {
    if (typingUsers.length === 0) return null
    if (typingUsers.length === 1) return "Someone is typing..."
    return `${typingUsers.length} people are typing...`
  }

  const handleHeaderClick = () => {
    if (chat.type === "group" && chat.group) {
      setShowGroupMembers(true)
    } else if (chat.type === "direct" && chat.participant) {
      setShowFriendOptions(true)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {isMobile && onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          {/* Chat Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                chat.type === "group"
                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                  : "bg-gradient-to-br from-blue-500 to-cyan-500"
              }`}
            >
              {chat.type === "group" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              ) : (
                getChatTitle().charAt(0).toUpperCase()
              )}
            </div>

            {/* Online indicator for direct chats */}
            {chat.type === "direct" && chat.participant?.status === "online" && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Chat Info - Clickable for groups and direct chats */}
          <div
            className={`flex-1 min-w-0 ${
              chat.type === "group" || chat.type === "direct"
                ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2 transition-colors"
                : ""
            }`}
            onClick={handleHeaderClick}
          >
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold text-gray-900 dark:text-white truncate">{getChatTitle()}</h2>
              {chat.type === "group" && <Users className="w-4 h-4 text-gray-400" />}
              {chat.type === "direct" && <MoreVertical className="w-4 h-4 text-gray-400" />}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{getChatSubtitle()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button variant="ghost" size="sm" className="p-2">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="w-20 h-20 mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-500 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-center font-medium">Start the conversation</p>
            <p className="text-sm text-center mt-1">Send a message to begin chatting with {getChatTitle()}</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUser.id
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId
              const showTimestamp =
                index === messages.length - 1 ||
                messages[index + 1].senderId !== message.senderId ||
                new Date(messages[index + 1].timestamp).getTime() - new Date(message.timestamp).getTime() > 300000 // 5 minutes

              return (
                <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    {!isOwnMessage && showAvatar && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {message.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {!isOwnMessage && !showAvatar && <div className="w-8 h-8 flex-shrink-0" />}

                    {/* Message Bubble */}
                    <div className="flex flex-col">
                      {!isOwnMessage && showAvatar && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-3">{message.senderName}</span>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                          isOwnMessage
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      </div>
                      {showTimestamp && (
                        <span
                          className={`text-xs text-gray-400 mt-1 ${isOwnMessage ? "text-right" : "text-left"} px-3`}
                        >
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{getTypingText()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          {/* Attachment Button */}
          <Button type="button" variant="ghost" size="sm" className="p-2 flex-shrink-0">
            <Paperclip className="w-5 h-5" />
          </Button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${getChatTitle()}...`}
              className="pr-12 py-3 rounded-2xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
              disabled={false}
            />

            {/* Emoji Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>

        {/* Typing indicator for current user */}
        {isTyping && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <div className="flex space-x-1 mr-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            You are typing...
          </div>
        )}
      </div>

      {/* Group Members Modal */}
      {showGroupMembers && chat.type === "group" && chat.group && (
        <GroupMembersModal
          group={chat.group}
          onClose={() => setShowGroupMembers(false)}
          currentUserId={currentUser.id}
        />
      )}

      {/* Friend Options Modal */}
      {showFriendOptions && chat.type === "direct" && chat.participant && onUnfriend && (
        <FriendOptionsModal
          friend={chat.participant}
          onClose={() => setShowFriendOptions(false)}
          onStartChat={() => {
            // Already in chat, just close modal
            setShowFriendOptions(false)
          }}
          onUnfriend={async (friendId: number) => {
            await onUnfriend(friendId)
            setShowFriendOptions(false)
          }}
        />
      )}
    </div>
  )
}
