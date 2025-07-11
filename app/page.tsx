"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { MessengerApp } from "@/components/messenger-app"
import type { User } from "@/types"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated by calling a protected endpoint
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Include cookies
        })

        if (response.ok) {
          const userData = await response.json()
          setCurrentUser(userData)
        } else {
          // User is not authenticated
          setCurrentUser(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  // Show messenger app if authenticated
  return <MessengerApp currentUser={currentUser} onLogout={handleLogout} />
}
