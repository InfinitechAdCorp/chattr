"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { usePWA } from "@/hooks/use-pwa"

export function PWAUpdateBanner() {
  const { isUpdateAvailable, updateApp } = usePWA()

  if (!isUpdateAvailable) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-green-500 text-white rounded-xl shadow-lg z-50 p-4 animate-slide-down">
      <div className="flex items-center space-x-3">
        <RefreshCw className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">Update Available</p>
          <p className="text-sm opacity-90">A new version of Chattr is ready</p>
        </div>
        <Button onClick={updateApp} size="sm" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
          Update
        </Button>
      </div>
    </div>
  )
}
