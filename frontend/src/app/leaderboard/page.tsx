"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  TrendingUp,
  GitBranch,
  Users
} from "lucide-react"

interface LeaderboardUser {
  _id: string
  name: string
  email: string
  points: number
  badges: string[]
  githubUsername?: string
  avatar?: string
  rank: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null)

  async function fetchLeaderboard() {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("http://localhost:5000/api/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data)

        // Find current user in leaderboard
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        const userInLeaderboard = data.find((user: LeaderboardUser) => user._id === userData.id)
        if (userInLeaderboard) {
          setCurrentUser(userInLeaderboard)
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchLeaderboard()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-100 text-yellow-800">Champion</Badge>
    if (rank === 2) return <Badge className="bg-gray-100 text-gray-800">Runner-up</Badge>
    if (rank === 3) return <Badge className="bg-amber-100 text-amber-800">Third Place</Badge>
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Trophy className="h-8 w-8 text-gray-900 dark:text-white" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Leaderboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Top performers in CampusConnect - earn points through tasks and GitHub contributions
          </p>
        </div>

        {/* Current User Card */}
        {currentUser && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-blue-500" />
                Your Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {getRankIcon(currentUser.rank)}
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{currentUser.name}</h3>
                    {getRankBadge(currentUser.rank)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentUser.points} points • {currentUser.badges.length} badges
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentUser.points}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard List */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Campus ambassadors ranked by points and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                    currentUser?._id === user._id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar and Info */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium truncate">{user.name}</p>
                      {getRankBadge(user.rank)}
                      {user.githubUsername && (
                        <div className="flex items-center text-sm text-gray-500">
                          <GitBranch className="h-3 w-3 mr-1" />
                          @{user.githubUsername}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{user.points} points</span>
                      <span>{user.badges.length} badges</span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="text-xl font-bold">{user.points}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>

                  {/* Badges Preview */}
                  {user.badges.length > 0 && (
                    <div className="flex space-x-1">
                      {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                        <Badge key={badgeIndex} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                      {user.badges.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.badges.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {leaderboard.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No rankings yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete tasks and earn points to appear on the leaderboard
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{leaderboard.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {leaderboard[0]?.points || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Highest Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {leaderboard.reduce((sum, user) => sum + user.points, 0)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}