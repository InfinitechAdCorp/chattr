"use client"

import { ArrowLeft, Menu, X } from 'lucide-react'
import type { User, Chat } from "@/types"

interface MobileHeaderProps {
  currentUser: User
  activeView: "chats" | "friends" | "groups"
  selectedChat: Chat | null
  onMenuClick: () => void
  onBack: () => void
  showMobileSidebar?: boolean
}

export function MobileHeader({ 
  currentUser, 
  activeView, 
  selectedChat, 
  onMenuClick, 
  onBack, 
  showMobileSidebar = false 
}: MobileHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between md:hidden">
      {selectedChat ? (
        <>
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3 flex-1 ml-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {selectedChat.type === "group" ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              ) : (
                selectedChat.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">{selectedChat.name}</h3>
              {selectedChat.type === "direct" && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedChat.participant?.status === "online" ? "Online" : "Last seen recently"}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <button 
            onClick={onMenuClick} 
            className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="font-semibold text-gray-900 dark:text-white">
            {activeView === "chats" && "Chats"}
            {activeView === "friends" && "Friends"}
            {activeView === "groups" && "Groups"}
          </h1>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
        </>
      )}
    </div>
  )
}
