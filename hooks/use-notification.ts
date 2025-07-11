"use client"

import { useCallback, useEffect, useState } from 'react'

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    }
    return permission
  }, [permission])

  const showNotification = useCallback((title: string, body: string, tag?: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        tag,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: false,
        silent: false
      })

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
  }, [])

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: 'Notification' in window
  }
}
