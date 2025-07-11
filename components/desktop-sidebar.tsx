"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Users,
  UsersRound,
  LogOut,
  Settings,
  Moon,
  Sun,
  Bell,
  Search,
  Gamepad2,
  Zap,
  Crown,
  Wifi,
  WifiOff,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"
import type { SidebarProps } from "@/types"

interface DesktopSidebarV2Props extends SidebarProps {
  unreadCount?: number
  onlineCount?: number
  isConnected?: boolean
  connectionStatus?: "connected" | "connecting" | "disconnected" | "disabled"
}

// VERSION 2: Dark Gaming/Discord-inspired with Neon Accents
export function DesktopSidebarV2({
  currentUser,
  activeView,
  onViewChange,
  onLogout,
  unreadCount = 0,
  onlineCount = 0,
  isConnected = true,
  connectionStatus = "disabled",
}: DesktopSidebarV2Props) {
  const [isDark, setIsDark] = useState(true)

  // Safe access to user properties with fallbacks
  const userFullName = currentUser?.fullName || currentUser?.username || "User"
  const userUsername = currentUser?.username || "user"
  const userId = currentUser?.id || 0
  const userInitial = userFullName.charAt(0).toUpperCase()

  const menuItems = [
    {
      id: "chats",
      label: "Chats",
      icon: MessageCircle,
      badge: unreadCount > 0 ? unreadCount : null,
      description: "Your conversations",
      neonColor: "cyan",
      glowColor: "shadow-cyan-500/50",
    },
    {
      id: "friends",
      label: "Friends",
      icon: Users,
      badge: onlineCount > 0 ? onlineCount : null,
      description: "Manage connections",
      neonColor: "green",
      glowColor: "shadow-green-500/50",
    },
    {
      id: "groups",
      label: "Groups",
      icon: UsersRound,
      badge: null,
      description: "Team conversations",
      neonColor: "purple",
      glowColor: "shadow-purple-500/50",
    },
  ]

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          text: "ONLINE",
          color: "text-green-400",
          bgColor: "bg-green-400",
          icon: CheckCircle,
        }
      case "connecting":
        return {
          text: "CONNECTING",
          color: "text-yellow-400",
          bgColor: "bg-yellow-400",
          icon: Wifi,
        }
      case "disconnected":
        return {
          text: "OFFLINE",
          color: "text-red-400",
          bgColor: "bg-red-400",
          icon: WifiOff,
        }
      default: // disabled
        return {
          text: "ONLINE",
          color: "text-green-400",
          bgColor: "bg-green-400",
          icon: CheckCircle,
        }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col shadow-2xl relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Neon Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse"></div>

      {/* Header */}
      <div className="p-6 border-b border-gray-800 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105 border border-cyan-500/30">
              {userInitial}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 ${statusInfo.bgColor} border-2 border-gray-900 rounded-full shadow-lg ${statusInfo.bgColor.replace("bg-", "shadow-")}/50 ${connectionStatus === "connecting" ? "animate-pulse" : ""} flex items-center justify-center`}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <Crown className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-white truncate text-xl flex items-center">
              {userFullName}
              <Zap className="w-4 h-4 ml-2 text-yellow-400 animate-pulse" />
            </h3>
            <p className="text-sm text-gray-400 truncate flex items-center">
              <Gamepad2 className="w-3 h-3 mr-1 text-cyan-400" />@{userUsername}
            </p>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-3 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className={`font-bold flex items-center ${statusInfo.color}`}>
            <div
              className={`w-2 h-2 ${statusInfo.bgColor} rounded-full mr-2 ${connectionStatus === "connecting" ? "animate-pulse" : ""}`}
            ></div>
            {statusInfo.text}
          </span>
          <span className="text-cyan-400 font-mono">#{userId.toString().padStart(4, "0")}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-800 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-12 justify-start bg-gray-800/50 hover:bg-gray-700/50 border border-cyan-500/30 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:border-cyan-500/50 group"
          >
            <Search className="w-4 h-4 mr-2 text-cyan-400 group-hover:animate-pulse" />
            <span className="font-bold text-gray-300 group-hover:text-white">SEARCH</span>
          </Button>
          <Button
            onClick={() => {
              // This should open friend requests modal
              // We'll need to pass this function down from the parent component
            }}
            variant="ghost"
            size="sm"
            className="h-12 justify-start bg-gray-800/50 hover:bg-gray-700/50 border border-purple-500/30 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:border-purple-500/50 group relative"
          >
            <Bell className="w-4 h-4 mr-2 text-purple-400 group-hover:animate-pulse" />
            <span className="font-bold text-gray-300 group-hover:text-white">ALERTS</span>
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white border-0 shadow-lg shadow-red-500/50 animate-pulse font-black text-xs min-w-[20px] h-5">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Connection Status - Only show if WebSocket is enabled */}
      {connectionStatus !== "disabled" && (
        <div className="px-6 py-2 border-b border-gray-800">
          <div className="flex items-center justify-center space-x-2 text-xs">
            <StatusIcon
              className={`w-4 h-4 ${statusInfo.color} ${connectionStatus === "connecting" ? "animate-pulse" : ""}`}
            />
            <span className={`${statusInfo.color} font-bold`}>
              {connectionStatus === "connected" && "REAL-TIME ENABLED"}
              {connectionStatus === "connecting" && "CONNECTING..."}
              {connectionStatus === "disconnected" && "RECONNECTING..."}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-4 relative z-10">
        <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
          NAVIGATION
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start h-18 px-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? `bg-gray-800 border-2 border-${item.neonColor}-500 shadow-xl ${item.glowColor} shadow-lg`
                  : "hover:bg-gray-800/50 hover:border hover:border-gray-600"
              }`}
              onClick={() => onViewChange(item.id as any)}
            >
              {isActive && (
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-${item.neonColor}-500/10 to-transparent animate-pulse`}
                ></div>
              )}
              <div className="flex items-center space-x-4 w-full relative z-10">
                <div
                  className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                    isActive
                      ? `bg-${item.neonColor}-500 text-white shadow-lg ${item.glowColor}`
                      : "bg-gray-700 border border-gray-600 text-gray-300 group-hover:border-gray-500"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-black text-lg ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"}`}
                    >
                      {item.label.toUpperCase()}
                    </span>
                    {item.badge && (
                      <Badge
                        className={`bg-${item.neonColor}-500 text-white border-0 shadow-lg ${item.glowColor} animate-pulse font-black`}
                      >
                        {item.badge > 99 ? "99+" : item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide">{item.description}</p>
                </div>
              </div>
            </Button>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-3 border-t border-gray-800 relative z-10">
        <Button
          variant="ghost"
          className="w-full justify-start h-16 px-4 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 border border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/25 hover:border-yellow-500/50 group"
          onClick={toggleTheme}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-yellow-500 text-black group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-500/50">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <span className="font-black text-gray-300 group-hover:text-white text-lg">
              {isDark ? "LIGHT MODE" : "DARK MODE"}
            </span>
          </div>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start h-16 px-4 rounded-2xl bg-gray-800/50 hover:bg-gray-700/50 border border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:border-blue-500/50 group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-blue-500 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/50">
              <Settings className="w-5 h-5" />
            </div>
            <span className="font-black text-gray-300 group-hover:text-white text-lg">SETTINGS</span>
          </div>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start h-16 px-4 rounded-2xl bg-red-900/20 hover:bg-red-800/30 border border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:border-red-500/50 group"
          onClick={onLogout}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-red-500 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/50">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-black text-red-400 group-hover:text-red-300 text-lg">SIGN OUT</span>
          </div>
        </Button>
      </div>
    </div>
  )
}
