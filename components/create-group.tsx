"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface CreateGroupModalProps {
  friends: any[]
  onClose: () => void
  onCreateGroup: (groupData: any) => void
}

export function CreateGroupModal({ friends, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])

  const handleMemberToggle = (friendId: number) => {
    setSelectedMembers((prev) => (prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]))
  }

  const handleCreate = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreateGroup({
        name: groupName.trim(),
        members: selectedMembers,
      })
      onClose()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>

          <div>
            <Label>Select Members</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`friend-${friend.id}`}
                    checked={selectedMembers.includes(friend.id)}
                    onCheckedChange={() => handleMemberToggle(friend.id)}
                  />
                  <Label htmlFor={`friend-${friend.id}`} className="flex items-center space-x-2 cursor-pointer">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {friend.full_name.charAt(0)}
                    </div>
                    <span>{friend.full_name}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!groupName.trim() || selectedMembers.length === 0}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
