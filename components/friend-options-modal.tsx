"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, UserMinus, X, Phone, Video, UserCheck, Settings } from 'lucide-react'
import { UnfriendConfirmationModal } from "@/components/unfriend-confirmation-modal"
import type { Friend } from "@/types"

interface FriendOptionsModalProps {
  friend: Friend
  onClose: () => void
  onStartChat: (friend: Friend) => void
  onUnfriend: (friendId: number) => Promise<void>
}

export function FriendOptionsModal({ friend, onClose, onStartChat, onUnfriend }: FriendOptionsModalProps) {
  const [showUnfriendConfirmation, setShowUnfriendConfirmation] = useState(false)

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleStartChat = () => {
    onStartChat(friend)
    onClose()
  }

  const handleUnfriendConfirm = async (friendId: number) => {
    await onUnfriend(friendId)
    setShowUnfriendConfirmation(false)
    onClose()
  }

  if (showUnfriendConfirmation) {
    return (
      <UnfriendConfirmationModal
        friend={friend}
        onClose={() => setShowUnfriendConfirmation(false)}
        onConfirm={handleUnfriendConfirm}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                  {friend.fullName.charAt(0).toUpperCase()}
                </div>
                {friend.status === "online" && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{friend.fullName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">@{friend.username}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2">
          {/* Primary Actions */}
          <Button
            onClick={handleStartChat}
            className="w-full justify-start h-14 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/20">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Send Message</div>
                <div className="text-xs opacity-90">Start a conversation</div>
              </div>
            </div>
          </Button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-14 flex-col space-y-1 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs">Call</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 flex-col space-y-1 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Video className="w-5 h-5" />
              <span className="text-xs">Video</span>
            </Button>
          </div>

          {/* Friend Status */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">Friends</span>
              <div className="flex-1"></div>
              <div className={`w-2 h-2 rounded-full ${friend.status === "online" ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}></div>
              <span className="text-xs text-green-700 dark:text-green-300 capitalize">{friend.status}</span>
            </div>
          </div>

          {/* Management Actions */}
          <div className="pt-2 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start h-12 px-4 rounded-xl border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Friend Settings</span>
              </div>
            </Button>

            <Button
              onClick={() => setShowUnfriendConfirmation(true)}
              variant="outline"
              className="w-full justify-start h-12 px-4 rounded-xl border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <UserMinus className="w-4 h-4" />
                <span className="text-sm font-medium">Remove Friend</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
            <span>Friends since joining • {friend.status === "online" ? "Active now" : "Last seen recently"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
