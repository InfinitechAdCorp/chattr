"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Search,
  UserPlus,
  Users,
  Clock,
  Sparkles,
  Star,
  Send,
  CheckCircle,
  UserCheck,
  AlertCircle,
} from "lucide-react"

interface FriendSuggestion {
  id: number
  username: string
  full_name: string
  status: "online" | "offline"
  suggestionType: "search" | "mutual" | "active" | "recommended"
  reason: string
  mutualFriends: number
  avatar?: string
  requestStatus?: "none" | "pending" | "sent" | "received"
}

interface PendingRequest {
  id: number
  userId: number
  username: string
  full_name: string
  status: "online" | "offline"
  createdAt: string
}

interface AddFriendModalProps {
  onClose: () => void
  onFriendRequestSent: () => void // This is the correct prop name
}

export function AddFriendModal({ onClose, onFriendRequestSent }: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([])
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [sendingRequests, setSendingRequests] = useState<Set<number>>(new Set())
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState<"search" | "pending">("search")
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Load initial suggestions and pending requests
  useEffect(() => {
    loadSuggestions("")
    loadPendingRequests()
  }, [])

  // Search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      loadSuggestions(searchQuery)
    }, 300)
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const loadSuggestions = async (query: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/friends/suggestions?query=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      }
    } catch (error) {
      console.error("Failed to load suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadPendingRequests = async () => {
    try {
      const response = await fetch("/api/friends/requests")
      if (response.ok) {
        const data = await response.json()
        setPendingRequests(data.outgoing || [])
      }
    } catch (error) {
      console.error("Failed to load pending requests:", error)
    }
  }

  const handleSendFriendRequest = async (suggestion: FriendSuggestion) => {
    if (sendingRequests.has(suggestion.id) || sentRequests.has(suggestion.id)) return
    try {
      setSendingRequests((prev) => new Set(prev).add(suggestion.id))
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: suggestion.id }),
      })
      if (response.ok) {
        setSentRequests((prev) => new Set(prev).add(suggestion.id))
        onFriendRequestSent() // Call the prop to notify parent
        // Reload pending requests to show the new request
        loadPendingRequests()
      } else {
        const errorData = await response.json()
        console.error("Failed to send friend request:", errorData.error)
      }
    } catch (error) {
      console.error("Failed to send friend request:", error)
    } finally {
      setSendingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(suggestion.id)
        return newSet
      })
    }
  }

  const handleCancelRequest = async (request: PendingRequest) => {
    try {
      const response = await fetch(`/api/friends/requests/${request.id}/cancel`, {
        method: "DELETE",
      })
      if (response.ok) {
        setPendingRequests((prev) => prev.filter((r) => r.id !== request.id))
        onFriendRequestSent() // Refresh parent component
      }
    } catch (error) {
      console.error("Failed to cancel friend request:", error)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "mutual":
        return <Users className="w-4 h-4 text-blue-500" />
      case "active":
        return <Clock className="w-4 h-4 text-green-500" />
      case "search":
        return <Search className="w-4 h-4 text-purple-500" />
      default:
        return <Sparkles className="w-4 h-4 text-yellow-500" />
    }
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "mutual":
        return "from-blue-500 to-cyan-500"
      case "active":
        return "from-green-500 to-emerald-500"
      case "search":
        return "from-purple-500 to-pink-500"
      default:
        return "from-yellow-500 to-orange-500"
    }
  }

  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      if (!acc[suggestion.suggestionType]) {
        acc[suggestion.suggestionType] = []
      }
      acc[suggestion.suggestionType].push(suggestion)
      return acc
    },
    {} as Record<string, FriendSuggestion[]>,
  )

  const getSectionTitle = (type: string) => {
    switch (type) {
      case "search":
        return "Search Results"
      case "mutual":
        return "People You May Know"
      case "active":
        return "Recently Active"
      default:
        return "Suggested for You"
    }
  }

  const getButtonContent = (suggestion: FriendSuggestion) => {
    if (sentRequests.has(suggestion.id)) {
      return (
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>Sent</span>
        </div>
      )
    }
    if (sendingRequests.has(suggestion.id)) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Sending...</span>
        </div>
      )
    }
    return (
      <div className="flex items-center space-x-2">
        <Send className="w-4 h-4" />
        <span>Send Request</span>
      </div>
    )
  }

  const getButtonStyle = (suggestion: FriendSuggestion) => {
    if (sentRequests.has(suggestion.id)) {
      return "px-4 py-2 bg-green-500 text-white rounded-lg font-medium cursor-default"
    }
    return "px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Friends</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Send friend requests to connect</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("search")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "search"
                  ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Find Friends</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                activeTab === "pending"
                  ? "bg-white dark:bg-gray-600 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Pending Requests</span>
                {pendingRequests.length > 0 && (
                  <Badge className="bg-orange-500 text-white border-0 text-xs min-w-[20px] h-5">
                    {pendingRequests.length}
                  </Badge>
                )}
              </div>
            </button>
          </div>
          {/* Search Bar - Only show in search tab */}
          {activeTab === "search" && (
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username or name..."
                className="pl-10 pr-4 py-3 rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Content */}
        <div className="overflow-y-auto max-h-96 p-6">
          {activeTab === "search" ? (
            // Search Tab Content
            suggestions.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-center font-medium">
                  {searchQuery ? "No users found" : "Start typing to search for friends"}
                </p>
                <p className="text-sm text-center mt-1">
                  {searchQuery ? "Try a different search term" : "Or browse our suggestions below"}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
                  <div key={type}>
                    {/* Section Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex items-center space-x-2">
                        {getSuggestionIcon(type)}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getSectionTitle(type)}</h3>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-600"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {typeSuggestions.length}
                      </span>
                    </div>
                    {/* Suggestions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {typeSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800 group"
                        >
                          <div className="flex items-center space-x-3">
                            {/* Avatar */}
                            <div className="relative">
                              <div
                                className={`w-12 h-12 bg-gradient-to-br ${getSuggestionColor(suggestion.suggestionType)} rounded-full flex items-center justify-center text-white font-semibold shadow-lg group-hover:scale-105 transition-transform`}
                              >
                                {suggestion.full_name.charAt(0).toUpperCase()}
                              </div>
                              {suggestion.status === "online" && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse">
                                  <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                                </div>
                              )}
                              {suggestion.suggestionType === "mutual" && suggestion.mutualFriends > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                                  <Star className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>
                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {suggestion.full_name}
                                </h4>
                                {suggestion.status === "online" && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs">
                                    Online
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                @{suggestion.username}
                              </p>
                              <div className="flex items-center space-x-1 mt-1">
                                {getSuggestionIcon(suggestion.suggestionType)}
                                <span className="text-xs text-gray-500 dark:text-gray-400">{suggestion.reason}</span>
                              </div>
                            </div>
                            {/* Add Button */}
                            <Button
                              onClick={() => handleSendFriendRequest(suggestion)}
                              disabled={sendingRequests.has(suggestion.id) || sentRequests.has(suggestion.id)}
                              className={getButtonStyle(suggestion)}
                            >
                              {getButtonContent(suggestion)}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : // Pending Requests Tab Content
          pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-orange-500" />
              </div>
              <p className="text-center font-medium">No pending requests</p>
              <p className="text-sm text-center mt-1">All your friend requests have been responded to</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Waiting for Response</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-600"></div>
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-0">
                  {pendingRequests.length} pending
                </Badge>
              </div>
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border border-orange-200 dark:border-orange-800 rounded-xl bg-orange-50 dark:bg-orange-900/10 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                        {request.full_name.charAt(0).toUpperCase()}
                      </div>
                      {request.status === "online" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
                      )}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                        <Clock className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">{request.full_name}</h4>
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-0 text-xs">
                          Pending
                        </Badge>
                        {request.status === "online" && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs">
                            Online
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{request.username}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-600 dark:text-orange-400">
                          Sent {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {/* Cancel Button */}
                    <Button
                      onClick={() => handleCancelRequest(request)}
                      variant="outline"
                      className="px-4 py-2 border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/20 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center space-x-2">
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </div>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Send className="w-3 h-3 text-blue-500" />
                <span>Send friend requests</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserCheck className="w-3 h-3 text-green-500" />
                <span>Wait for acceptance</span>
              </div>
            </div>
            <span>
              {activeTab === "search"
                ? `${suggestions.length} suggestions • ${sentRequests.size} requests sent`
                : `${pendingRequests.length} pending requests`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
