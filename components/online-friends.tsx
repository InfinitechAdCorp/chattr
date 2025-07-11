"use client"

import type { Friend } from "@/types"

interface OnlineFriendsProps {
  friends: Friend[]
  onStartChat: (friend: Friend) => void
}

export function OnlineFriends({ friends, onStartChat }: OnlineFriendsProps) {
  if (friends.length === 0) return null

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Online Friends</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">{friends.length} online</span>
      </div>
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {friends.map((friend) => (
          <button
            key={friend.id}
            onClick={() => onStartChat(friend)}
            className="flex-shrink-0 flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {friend.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300 text-center max-w-[60px] truncate">
              {friend.fullName.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
