"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  GitBranch,
  Search,
  TrendingUp,
  Code,
  Award
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

interface GitHubProfile {
  username: string
  name: string
  bio: string
  avatar_url: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  total_stars: number
  total_forks: number
  total_watchers: number
  languages: { [key: string]: number }
  recent_activity: unknown[]
  score: number
  suggestions: string[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyzerPage() {
  const [username, setUsername] = useState("")
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a GitHub username",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/github/analyze/${username}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        toast({
          title: "Analysis complete",
          description: `Successfully analyzed ${username}'s GitHub profile`,
        })
      } else {
        const error = await response.json()
        toast({
          title: "Analysis failed",
          description: error.message || "Failed to analyze profile",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const languageData = profile?.languages ? Object.entries(profile.languages).map(([name, value]) => ({
    name,
    value
  })) : []

  const mockActivityData = [
    { date: '2024-01', commits: 45, prs: 8 },
    { date: '2024-02', commits: 52, prs: 12 },
    { date: '2024-03', commits: 38, prs: 6 },
    { date: '2024-04', commits: 67, prs: 15 },
    { date: '2024-05', commits: 43, prs: 9 },
    { date: '2024-06', commits: 58, prs: 11 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <GitBranch className="h-8 w-8 text-gray-900 dark:text-white" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              GitHub Profile Analyzer
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Analyze GitHub profiles to get insights, scores, and improvement suggestions
            for campus ambassadors and developers.
          </p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Analyze Profile
            </CardTitle>
            <CardDescription>
              Enter a GitHub username to get detailed analysis and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="username">GitHub Username</Label>
                <Input
                  id="username"
                  placeholder="e.g., octocat"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAnalyze} disabled={loading}>
                  {loading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Overview */}
        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="w-16 h-16 rounded-full"
                    width={64}
                    height={64}
                  />
                  <div>
                    <h3 className="font-semibold">{profile.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@{profile.username}</p>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{profile.bio}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{profile.followers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{profile.following}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{profile.public_repos}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Repos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{profile.total_stars}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Stars</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profile Score</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {profile.score}/100
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Language Distribution */}
              {languageData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Language Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={languageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {languageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="commits" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="prs" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {profile?.suggestions && profile.suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Improvement Suggestions
              </CardTitle>
              <CardDescription>
                Ways to improve your GitHub profile and increase your score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}