"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Crown, Shield, User, Phone, Video, MessageCircle } from 'lucide-react'
import type { Group, Friend } from "@/types"

interface GroupMember extends Friend {
  role?: "admin" | "member"
  joinedAt?: string
}

interface GroupMembersModalProps {
  group: Group
  onClose: () => void
  currentUserId: number
}

export function GroupMembersModal({ group, onClose, currentUserId }: GroupMembersModalProps) {
  const [members, setMembers] = useState<GroupMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMembers = async () => {
      try {
        // In a real app, you'd have an API endpoint to get group members with details
        // For now, we'll simulate this with the friends API and group member IDs
        const response = await fetch("/api/friends")
        if (response.ok) {
          const allFriends = await response.json()
          
          // Filter friends that are in this group and add role information
          const groupMembers = allFriends
            .filter((friend: Friend) => group.members.includes(friend.id))
            .map((friend: Friend) => ({
              ...friend,
              role: friend.id === group.createdBy ? "admin" : "member",
              joinedAt: new Date().toISOString(), // Mock data
            }))

          // Add current user if they're in the group
          if (group.members.includes(currentUserId)) {
            // We need to get current user info - for now we'll add a placeholder
            groupMembers.push({
              id: currentUserId,
              username: "You",
              fullName: "You",
              status: "online",
              role: currentUserId === group.createdBy ? "admin" : "member",
              joinedAt: new Date().toISOString(),
            })
          }

          setMembers(groupMembers)
        }
      } catch (error) {
        console.error("Failed to load group members:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMembers()
  }, [group, currentUserId])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const admins = members.filter(member => member.role === "admin")
  const regularMembers = members.filter(member => member.role === "member")

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{group.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {members.length} {members.length === 1 ? 'member' : 'members'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {/* Admins Section */}
              {admins.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Admins
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {admins.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                          {member.status === "online" && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {member.id === currentUserId ? "You" : member.fullName}
                            </p>
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0 text-xs">
                              Admin
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            @{member.username} • {member.status}
                          </p>
                        </div>
                        {member.id !== currentUserId && (
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="p-2">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-2">
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Members Section */}
              {regularMembers.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Members
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {regularMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                          {member.status === "online" && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {member.id === currentUserId ? "You" : member.fullName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            @{member.username} • {member.status}
                          </p>
                        </div>
                        {member.id !== currentUserId && (
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="p-2">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-2">
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Created by {admins.find(a => a.id === group.createdBy)?.fullName || 'Unknown'}</span>
            <span>{members.length} total members</span>
          </div>
        </div>
      </div>
    </div>
  )
}
