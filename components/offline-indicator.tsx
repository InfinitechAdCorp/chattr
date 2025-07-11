"use client"

import { WifiOff } from "lucide-react"
import { usePWA } from "@/hooks/use-pwa"

export function OfflineIndicator() {
  const { isOnline } = usePWA()

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-2 animate-pulse">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">You're offline</span>
    </div>
  )
}
