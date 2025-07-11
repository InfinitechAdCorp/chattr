"use client"

import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import type { GroupsListProps } from "@/types"

export function GroupsList({ groups, friends, onCreateGroup, onSelectGroup }: GroupsListProps) {
  const getFriendName = (friendId: number): string => {
    const friend = friends.find((f) => f.id === friendId)
    return friend ? friend.fullName : "Unknown"
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Groups</h2>
        <Button onClick={onCreateGroup} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="space-y-2">
        {groups.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No groups yet. Create a group to chat with multiple friends!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectGroup(group)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.members?.length} members</p>
                  <p className="text-xs text-gray-400">
                    Members: {group.members?.map((id) => getFriendName(id)).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
