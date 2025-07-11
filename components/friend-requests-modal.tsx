"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, UserCheck, UserX, Clock, Send, Users, CheckCircle, XCircle } from 'lucide-react'
import { formatDistanceToNow } from "date-fns"

interface FriendRequest {
  id: number
  userId: number
  username: string
  fullName: string
  status: "online" | "offline"
  type: "incoming" | "outgoing"
  createdAt: string
}

interface FriendRequestsModalProps {
  onClose: () => void
  onRequestHandled: () => void
}

export function FriendRequestsModal({ onClose, onRequestHandled }: FriendRequestsModalProps) {
  const [requests, setRequests] = useState<{ incoming: FriendRequest[]; outgoing: FriendRequest[] }>({
    incoming: [],
    outgoing: [],
  })
  const [loading, setLoading] = useState(true)
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set())

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/friends/requests")
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Failed to load friend requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (request: FriendRequest) => {
    if (processingRequests.has(request.id)) return

    try {
      setProcessingRequests((prev) => new Set(prev).add(request.id))
      const response = await fetch(`/api/friends/requests/${request.id}/accept`, {
        method: "POST",
      })

      if (response.ok) {
        setRequests((prev) => ({
          ...prev,
          incoming: prev.incoming.filter((r) => r.id !== request.id),
        }))
        onRequestHandled()
      }
    } catch (error) {
      console.error("Failed to accept friend request:", error)
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(request.id)
        return newSet
      })
    }
  }

  const handleRejectRequest = async (request: FriendRequest) => {
    if (processingRequests.has(request.id)) return

    try {
      setProcessingRequests((prev) => new Set(prev).add(request.id))
      const response = await fetch(`/api/friends/requests/${request.id}/reject`, {
        method: "POST",
      })

      if (response.ok) {
        setRequests((prev) => ({
          ...prev,
          incoming: prev.incoming.filter((r) => r.id !== request.id),
        }))
        onRequestHandled()
      }
    } catch (error) {
      console.error("Failed to reject friend request:", error)
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(request.id)
        return newSet
      })
    }
  }

  const handleCancelRequest = async (request: FriendRequest) => {
    if (processingRequests.has(request.id)) return

    try {
      setProcessingRequests((prev) => new Set(prev).add(request.id))
      const response = await fetch(`/api/friends/requests/${request.id}/cancel`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRequests((prev) => ({
          ...prev,
          outgoing: prev.outgoing.filter((r) => r.id !== request.id),
        }))
        onRequestHandled()
      }
    } catch (error) {
      console.error("Failed to cancel friend request:", error)
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(request.id)
        return newSet
      })
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const totalRequests = requests.incoming.length + requests.outgoing.length

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Friend Requests</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {totalRequests === 0 ? "No pending requests" : `${totalRequests} pending request${totalRequests > 1 ? "s" : ""}`}
                </p>
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
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : totalRequests === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-center font-medium">No friend requests</p>
              <p className="text-sm text-center mt-1">All caught up! No pending friend requests at the moment.</p>
            </div>
          ) : (
            <div className="p-6 space-y-8">
              {/* Incoming Requests */}
              {requests.incoming.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Incoming Requests</h3>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-600"></div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                      {requests.incoming.length}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {requests.incoming.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-green-300 dark:hover:border-green-600 bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                              {request.fullName.charAt(0).toUpperCase()}
                            </div>
                            {request.status === "online" && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
                            )}
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {request.fullName}
                              </h4>
                              {request.status === "online" && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs">
                                  Online
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{request.username}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleAcceptRequest(request)}
                              disabled={processingRequests.has(request.id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                              {processingRequests.has(request.id) ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Accept</span>
                                </div>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleRejectRequest(request)}
                              disabled={processingRequests.has(request.id)}
                              variant="outline"
                              className="px-4 py-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                              {processingRequests.has(request.id) ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <XCircle className="w-4 h-4" />
                                  <span>Reject</span>
                                </div>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outgoing Requests */}
              {requests.outgoing.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Send className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sent Requests</h3>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-600"></div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                      {requests.outgoing.length}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {requests.outgoing.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                              {request.fullName.charAt(0).toUpperCase()}
                            </div>
                            {request.status === "online" && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse"></div>
                            )}
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {request.fullName}
                              </h4>
                              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0 text-xs">
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
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Sent {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          {/* Cancel Button */}
                          <Button
                            onClick={() => handleCancelRequest(request)}
                            disabled={processingRequests.has(request.id)}
                            variant="outline"
                            className="px-4 py-2 border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {processingRequests.has(request.id) ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Accept or reject incoming requests</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-blue-500" />
                <span>Cancel sent requests</span>
              </div>
            </div>
            <span>
              {requests.incoming.length} incoming • {requests.outgoing.length} outgoing
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
