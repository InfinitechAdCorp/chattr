"use client"

import { useEffect, useState } from "react"

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  isUpdateAvailable: boolean
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: true,
    isUpdateAvailable: false,
  })
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null)

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const isInstalled = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://')
      
      setPwaState(prev => ({ ...prev, isInstalled }))
    }

    // Check online status
    const updateOnlineStatus = () => {
      setPwaState(prev => ({ ...prev, isOnline: navigator.onLine }))
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as PWAInstallPrompt)
      setPwaState(prev => ({ ...prev, isInstallable: true }))
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setInstallPrompt(null)
      setPwaState(prev => ({ 
        ...prev, 
        isInstallable: false, 
        isInstalled: true 
      }))
    }

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('Service Worker registered:', registration)

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setPwaState(prev => ({ ...prev, isUpdateAvailable: true }))
                }
              })
            }
          })

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute

        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }
    }

    checkInstalled()
    updateOnlineStatus()
    registerServiceWorker()

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const installApp = async () => {
    if (!installPrompt) return false

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        setInstallPrompt(null)
        setPwaState(prev => ({ 
          ...prev, 
          isInstallable: false,
          isInstalled: true 
        }))
        return true
      }
      return false
    } catch (error) {
      console.error('Error installing app:', error)
      return false
    }
  }

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      })
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const subscribeToPushNotifications = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        })
        
        // Send subscription to your backend
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        })
        
        return subscription
      } catch (error) {
        console.error('Error subscribing to push notifications:', error)
        return null
      }
    }
    return null
  }

  return {
    ...pwaState,
    installApp,
    updateApp,
    requestNotificationPermission,
    subscribeToPushNotifications,
  }
}
