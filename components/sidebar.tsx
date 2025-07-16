"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Users, UsersRound, LogOut, Settings, Moon, Sun, X } from 'lucide-react'
import { useState } from "react"
import type { SidebarProps } from "@/types"

interface ExtendedSidebarProps extends SidebarProps {
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({
  currentUser,
  activeView,
  onViewChange,
  onLogout,
  isMobile = false,
  onClose,
}: ExtendedSidebarProps) {
  const [isDark, setIsDark] = useState(false)

  // Helper function to safely get first character
  const getInitial = (name: string | undefined | null): string => {
    if (!name || typeof name !== "string" || name.length === 0) {
      return "?"
    }
    return name.charAt(0).toUpperCase()
  }

  const menuItems = [
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "friends", label: "Friends", icon: Users },
    { id: "groups", label: "Groups", icon: UsersRound },
  ]

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  if (isMobile) {
    return (
      <div className="w-64 bg-white dark:bg-gray-800 h-full flex flex-col shadow-xl">
        {/* Mobile Header with Close Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {getInitial(currentUser?.full_name)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{currentUser?.full_name || "Unknown User"}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{currentUser?.username || "unknown"}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start h-12 px-4 ${
                  activeView === item.id
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => onViewChange(item.id as any)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-4 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* User Avatar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {getInitial(currentUser?.full_name)}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col space-y-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`w-12 h-12 p-0 rounded-xl transition-all duration-200 ${
                activeView === item.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => onViewChange(item.id as any)}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </Button>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 space-y-1 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0 rounded-xl text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          onClick={onLogout}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
