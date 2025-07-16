"use client"

import type React from "react"
import type { Friend } from "@/types" // Import the global Friend type

interface OnlineFriendsProps {
  friends: Friend[] // Changed from onlineFriends to friends to match usage in MessengerApp.tsx
  onStartChat: (friend: Friend) => Promise<void>
}

const OnlineFriends: React.FC<OnlineFriendsProps> = ({ friends, onStartChat }) => {
  // Destructure 'friends'
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
        Online Friends ({friends.length} online)
      </h3>
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {friends.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No friends online.</p>
        ) : (
          friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => {
                console.log("Online friend clicked:", friend)
                onStartChat(friend)
              }}
              className="flex flex-col items-center space-y-1 flex-shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            >
              <div className="relative w-12 h-12">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {friend.full_name.charAt(0).toUpperCase()}
                </div>
                {friend.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                )}
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate w-16 text-center group-hover:text-blue-500 transition-colors">
                {friend.username}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default OnlineFriends
