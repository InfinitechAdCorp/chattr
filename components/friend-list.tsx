"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, MessageCircle, Users, Bell, MoreVertical } from "lucide-react"
import { useState } from "react"
import { FriendRequestsModal } from "@/components/friend-requests-modal"
import { FriendOptionsModal } from "@/components/friend-options-modal"
import type { FriendsListProps } from "@/types"

interface ExtendedFriendsListProps extends FriendsListProps {
  onUnfriend?: (friendId: number) => Promise<void>
}

export function FriendsList({ friends, onAddFriend, onStartChat, onUnfriend, searchQuery }: ExtendedFriendsListProps) {
  const [showRequests, setShowRequests] = useState(false)
  const [requestCount, setRequestCount] = useState(0)
  const [selectedFriend, setSelectedFriend] = useState<any>(null)

  // Load request count on mount
  React.useEffect(() => {
    const loadRequestCount = async () => {
      try {
        const response = await fetch("/api/friends/requests")
        if (response.ok) {
          const data = await response.json()
          setRequestCount(data.incoming.length)
        }
      } catch (error) {
        console.error("Failed to load request count:", error)
      }
    }
    loadRequestCount()
  }, [])

  const handleRequestHandled = () => {
    // Reload request count
    const loadRequestCount = async () => {
      try {
        const response = await fetch("/api/friends/requests")
        if (response.ok) {
          const data = await response.json()
          setRequestCount(data.incoming.length)
        }
      } catch (error) {
        console.error("Failed to load request count:", error)
      }
    }
    loadRequestCount()
  }

  const handleUnfriend = async (friendId: number) => {
    if (onUnfriend) {
      await onUnfriend(friendId)
    }
  }

  if (friends.length === 0 && !searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <Users className="w-10 h-10 text-blue-500 dark:text-blue-400" />
        </div>
        <p className="text-center font-medium mb-2">No friends yet</p>
        <p className="text-sm text-center mb-6 max-w-xs leading-relaxed">
          Start building your network by adding friends and connecting with people you know.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onAddFriend}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add Friends
          </Button>
          {requestCount > 0 && (
            <Button
              onClick={() => setShowRequests(true)}
              variant="outline"
              className="px-6 py-3 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 relative"
            >
              <Bell className="w-5 h-5 mr-2" />
              Friend Requests
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-0 shadow-lg shadow-red-500/25 animate-pulse font-bold text-xs min-w-[20px] h-5">
                {requestCount}
              </Badge>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {/* Friend Requests Button */}
      {requestCount > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <Button
            onClick={() => setShowRequests(true)}
            className="w-full justify-between bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 p-4"
          >
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5" />
              <span>
                You have {requestCount} friend request{requestCount > 1 ? "s" : ""}
              </span>
            </div>
            <Badge className="bg-white/20 text-white border-0 shadow-lg animate-pulse font-bold">{requestCount}</Badge>
          </Button>
        </div>
      )}

      {friends.map((friend) => (
        <div key={friend.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg group-hover:scale-105 transition-transform">
                {friend.fullName.charAt(0).toUpperCase()}
              </div>
              {friend.status === "online" && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse">
                  <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                </div>
              )}
            </div>

            {/* Friend Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{friend.fullName}</h3>
                {friend.status === "online" && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs animate-pulse">
                    Online
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{friend.username}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={() => onStartChat(friend)}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button
                onClick={() => setSelectedFriend(friend)}
                size="sm"
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Friend Requests Modal */}
      {showRequests && (
        <FriendRequestsModal onClose={() => setShowRequests(false)} onRequestHandled={handleRequestHandled} />
      )}

      {/* Friend Options Modal */}
      {selectedFriend && (
        <FriendOptionsModal
          friend={selectedFriend}
          onClose={() => setSelectedFriend(null)}
          onStartChat={onStartChat}
          onUnfriend={handleUnfriend}
        />
      )}
    </div>
  )
}
