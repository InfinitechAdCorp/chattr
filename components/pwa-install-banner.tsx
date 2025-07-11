"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Smartphone } from 'lucide-react'
import { usePWA } from "@/hooks/use-pwa"

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, installApp } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  if (!isInstallable || isInstalled || dismissed) {
    return null
  }

  const handleInstall = async () => {
    const success = await installApp()
    if (!success) {
      setDismissed(true)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl z-50 p-4 animate-slide-up">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg">Install Chattr by Justin</h3>
          <p className="text-sm opacity-90">Get the full app experience with offline support</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleInstall}
            size="sm"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button
            onClick={() => setDismissed(true)}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
