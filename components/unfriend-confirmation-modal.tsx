"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, UserMinus, X } from 'lucide-react'
import type { Friend } from "@/types"

interface UnfriendConfirmationModalProps {
  friend: Friend
  onClose: () => void
  onConfirm: (friendId: number) => Promise<void>
}

export function UnfriendConfirmationModal({ friend, onClose, onConfirm }: UnfriendConfirmationModalProps) {
  const [isUnfriending, setIsUnfriending] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsUnfriending(true)
      await onConfirm(friend.id)
      onClose()
    } catch (error) {
      console.error("Failed to unfriend:", error)
    } finally {
      setIsUnfriending(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Remove Friend</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-full"
              disabled={isUnfriending}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Friend Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {friend.full_name.charAt(0).toUpperCase()}
              </div>
              {friend.status === "online" && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">{friend.full_name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{friend.username}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${friend.status === "online" ? "bg-green-400" : "bg-gray-400"}`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{friend.status}</span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Are you sure you want to remove {friend.full_name}?
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• You will no longer be friends</li>
                  <li>• Your chat history will be deleted</li>
                  <li>• You'll need to send a new friend request to reconnect</li>
                  <li>• They won't be notified about this action</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 px-4 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl font-medium transition-all duration-300"
              disabled={isUnfriending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isUnfriending}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isUnfriending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Removing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserMinus className="w-4 h-4" />
                  <span>Remove Friend</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            This action is permanent and cannot be undone. Consider blocking instead if you want to avoid future contact.
          </p>
        </div>
      </div>
    </div>
  )
}
