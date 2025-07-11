"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Users, UsersRound, Sparkles, ArrowRight } from 'lucide-react'
import type { User } from "@/types"

interface WelcomeScreenProps {
  currentUser: User
  onGetStarted: () => void
}

export function WelcomeScreen({ currentUser, onGetStarted }: WelcomeScreenProps) {
  const features = [
    {
      icon: MessageCircle,
      title: "Instant Messaging",
      description: "Send messages instantly with real-time delivery",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Connect with Friends",
      description: "Add friends and stay connected with people you care about",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: UsersRound,
      title: "Group Conversations",
      description: "Create groups and chat with multiple friends at once",
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Messenger
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Hello, <span className="font-semibold text-blue-600 dark:text-blue-400">{currentUser.fullName}</span>! 👋
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Ready to connect with friends and start amazing conversations?
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">0</div>
              <div className="text-gray-600 dark:text-gray-300">Active Chats</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">0</div>
              <div className="text-gray-600 dark:text-gray-300">Friends</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">0</div>
              <div className="text-gray-600 dark:text-gray-300">Groups</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Start by adding friends or creating your first group chat
          </p>
        </div>
      </div>
    </div>
  )
}
