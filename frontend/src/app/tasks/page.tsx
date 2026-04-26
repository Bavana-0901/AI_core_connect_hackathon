"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Target,
  Calendar,
  Trophy,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

interface Task {
  _id: string
  title: string
  description: string
  points: number
  deadline: string
  status: 'pending' | 'completed' | 'overdue'
  type: string
  requirements: string[]
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function fetchTasks() {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchTasks()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  const submitTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`http://localhost:5000/api/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId,
          submissionUrl: "https://github.com/example/repo", // This would be a form input
          description: "Task completed successfully",
        }),
      })

      if (response.ok) {
        toast({
          title: "Task submitted",
          description: "Your task submission has been recorded",
        })
        fetchTasks() // Refresh tasks
      } else {
        const error = await response.json()
        toast({
          title: "Submission failed",
          description: error.message || "Failed to submit task",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Target className="h-8 w-8 text-gray-900 dark:text-white" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Available Tasks
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete tasks to earn points, unlock badges, and improve your GitHub profile
          </p>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card key={task._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                  </div>
                  {getStatusBadge(task.status)}
                </div>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Task Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                      Points:
                    </span>
                    <span className="font-semibold">{task.points}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                      Deadline:
                    </span>
                    <span>{new Date(task.deadline).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Type:</span>
                    <Badge variant="outline">{task.type}</Badge>
                  </div>
                </div>

                {/* Requirements */}
                {task.requirements && task.requirements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {task.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                {task.status === 'pending' && (
                  <Button
                    className="w-full"
                    onClick={() => submitTask(task._id)}
                  >
                    Submit Task
                  </Button>
                )}

                {task.status === 'completed' && (
                  <div className="text-center text-green-600 font-medium">
                    ✓ Task Completed
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check back later for new tasks and opportunities
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}