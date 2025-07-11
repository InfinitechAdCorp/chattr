"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, MessageCircle } from "lucide-react"
import type { FriendsListProps } from "@/types"

export function FriendsList({ friends, onAddFriend, onStartChat }: FriendsListProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Friends</h2>
        <Button onClick={onAddFriend} size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </Button>
      </div>

      <div className="space-y-2">
        {friends.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No friends yet. Add some friends to start chatting!</p>
          </div>
        ) : (
          friends.map((friend) => (
            <div key={friend.id} className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {friend.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{friend.fullName}</h3>
                    <p className="text-sm text-gray-500">@{friend.username}</p>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          friend.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-xs text-gray-500 capitalize">{friend.status}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => onStartChat(friend)} size="sm" variant="outline">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
