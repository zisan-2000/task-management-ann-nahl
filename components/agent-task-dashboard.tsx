"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Play,
  LinkIcon,
  MessageSquare,
  TrendingUp,
  Activity,
  List,
  Grid,
  Star,
  Timer,
  Target,
  Check,
  Loader2,
} from "lucide-react"

interface Task {
  id: string
  name: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "completed" | "overdue" | "cancelled"
  dueDate: string | null
  idealDurationMinutes: number | null
  actualDurationMinutes: number | null
  performanceRating: "Excellent" | "Good" | "Average" | "Lazy" | null
  completionLink: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  assignment: {
    id: string
    client: {
      id: string
      name: string
      avatar: string | null
    } | null
    template: {
      id: string
      name: string
    } | null
  } | null
  templateSiteAsset: {
    id: number
    name: string
    type: string
    url: string | null
  } | null
  category: {
    id: string
    name: string
  } | null
  assignedTo: {
    id: string
    firstName: string
    lastName: string
    email: string
    image: string | null
  } | null
  comments: Array<{
    id: string
    text: string
    date: string
    author: {
      id: string
      firstName: string
      lastName: string
      image: string | null
    } | null
  }>
}

interface TaskStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
  cancelled: number
}

interface AgentTasksResponse {
  tasks: Task[]
  stats: TaskStats
}

// Enhanced status badges
const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <Play className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      )
    case "overdue":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// Priority badges
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "urgent":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Urgent
        </Badge>
      )
    case "high":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800">
          <TrendingUp className="w-3 h-3 mr-1" />
          High
        </Badge>
      )
    case "medium":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
          <Target className="w-3 h-3 mr-1" />
          Medium
        </Badge>
      )
    case "low":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
          <Timer className="w-3 h-3 mr-1" />
          Low
        </Badge>
      )
    default:
      return <Badge variant="secondary">{priority}</Badge>
  }
}

// Performance rating badges
const getPerformanceRatingBadge = (rating: string | null) => {
  if (!rating) return null
  switch (rating) {
    case "Excellent":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
          <Star className="w-3 h-3 mr-1" />
          Excellent
        </Badge>
      )
    case "Good":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
          <Star className="w-3 h-3 mr-1" />
          Good
        </Badge>
      )
    case "Average":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
          <Star className="w-3 h-3 mr-1" />
          Average
        </Badge>
      )
    case "Lazy":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
          <Star className="w-3 h-3 mr-1" />
          Lazy
        </Badge>
      )
    default:
      return <Badge variant="secondary">{rating}</Badge>
  }
}

// Helper function for date formatting
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not set"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Helper function for duration formatting
const formatDuration = (minutes: number | null) => {
  if (!minutes) return "Not set"
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

// Task Status Update Modal Component
function TaskStatusModal({
  isOpen,
  onOpenChange,
  selectedTasks,
  onUpdateTasks,
  isUpdating,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedTasks: Task[]
  onUpdateTasks: (action: "completed" | "pending", completionLink?: string) => Promise<void>
  isUpdating: boolean
}) {
  const [completionLink, setCompletionLink] = useState("")

  const handleAction = async (action: "completed" | "pending") => {
    await onUpdateTasks(action, action === "completed" ? completionLink : undefined)
    onOpenChange(false)
    setCompletionLink("") // Reset the completion link after action
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setCompletionLink("") // Reset when closing
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-50">Update Task Status</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            You have selected {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""}. Choose the status to
            apply to all selected tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-50 mb-2">Selected Tasks:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">{task.name}</span>
                    {getStatusBadge(task.status)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Completion Link Field */}
          <div className="space-y-2">
            <Label htmlFor="completion-link" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Completion Link (Optional)
            </Label>
            <Input
              id="completion-link"
              value={completionLink}
              onChange={(e) => setCompletionLink(e.target.value)}
              placeholder="https://example.com/completed-work"
              className="w-full"
              disabled={isUpdating}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add a link to the completed work (will only be applied when marking as completed)
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={() => handleClose(false)} disabled={isUpdating} className="flex-1">
            Cancel
          </Button>
          <Button onClick={() => handleAction("pending")} disabled={isUpdating} variant="secondary" className="flex-1">
            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Clock className="w-4 h-4 mr-2" />}
            Mark as Pending
          </Button>
          <Button
            onClick={() => handleAction("completed")}
            disabled={isUpdating}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Mark as Completed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Task Details Dialog
function TaskDetailsDialog({
  task,
  isOpen,
  onOpenChange,
  onUpdateTask,
}: {
  task: Task | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (taskId: string, updates: any) => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState("")
  const [performanceRating, setPerformanceRating] = useState("")
  const [completionLink, setCompletionLink] = useState("")
  const [actualDurationMinutes, setActualDurationMinutes] = useState("")

  useEffect(() => {
    if (task) {
      setStatus(task.status)
      setPerformanceRating(task.performanceRating || "")
      setCompletionLink(task.completionLink || "")
      setActualDurationMinutes(task.actualDurationMinutes?.toString() || "")
    }
  }, [task])

  const handleUpdateTask = async () => {
    if (!task) return
    setIsUpdating(true)
    try {
      const updates = {
        status,
        ...(performanceRating && { performanceRating }),
        ...(completionLink && { completionLink }),
        ...(actualDurationMinutes && { actualDurationMinutes: Number.parseInt(actualDurationMinutes) }),
      }
      await onUpdateTask(task.id, updates)
      toast.success("Task updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update task")
    } finally {
      setIsUpdating(false)
    }
  }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50 pr-4">{task.name}</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                Task ID: {task.id}
              </DialogDescription>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(task.status)}
              {getPriorityBadge(task.priority)}
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          {/* Task Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Task Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Client</p>
                <p className="text-gray-900 dark:text-gray-50">
                  {task.assignment?.client?.name || "No client assigned"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Template</p>
                <p className="text-gray-900 dark:text-gray-50">{task.assignment?.template?.name || "No template"}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</p>
                <p className="text-gray-900 dark:text-gray-50">{task.category?.name || "No category"}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Site/Asset</p>
                <p className="text-gray-900 dark:text-gray-50">{task.templateSiteAsset?.name || "No asset"}</p>
              </div>
            </div>
          </div>
          <Separator />
          {/* Timing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-500" />
              Timing Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</p>
                <p className="text-gray-900 dark:text-gray-50">{formatDate(task.dueDate)}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ideal Duration</p>
                <p className="text-gray-900 dark:text-gray-50">{formatDuration(task.idealDurationMinutes)}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Actual Duration</p>
                <p className="text-gray-900 dark:text-gray-50">{formatDuration(task.actualDurationMinutes)}</p>
              </div>
            </div>
          </div>
          <Separator />
          {/* Update Task Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
              <Edit className="w-5 h-5 mr-2 text-purple-500" />
              Update Task
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="performance">Performance Rating</Label>
                <Select value={performanceRating} onValueChange={setPerformanceRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Lazy">Lazy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="completion-link">Completion Link</Label>
                <Input
                  id="completion-link"
                  value={completionLink}
                  onChange={(e) => setCompletionLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actual-duration">Actual Duration (minutes)</Label>
                <Input
                  id="actual-duration"
                  type="number"
                  value={actualDurationMinutes}
                  onChange={(e) => setActualDurationMinutes(e.target.value)}
                  placeholder="120"
                />
              </div>
            </div>
            <Button onClick={handleUpdateTask} disabled={isUpdating} className="w-full">
              {isUpdating ? "Updating..." : "Update Task"}
            </Button>
          </div>
          {/* Performance Rating */}
          {task.performanceRating && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Performance Rating
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  {getPerformanceRatingBadge(task.performanceRating)}
                </div>
              </div>
            </>
          )}
          {/* Completion Link */}
          {task.completionLink && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Completion Link
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <a
                    href={task.completionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline break-all"
                  >
                    {task.completionLink}
                  </a>
                </div>
              </div>
            </>
          )}
          {/* Comments */}
          {task.comments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                  Comments ({task.comments.length})
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author?.image || "/placeholder.svg"} />
                          <AvatarFallback>
                            {comment.author?.firstName?.charAt(0)}
                            {comment.author?.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            {comment.author?.firstName} {comment.author?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.date)}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Task Card Component
function TaskCard({
  task,
  onViewDetails,
  isSelected,
  onToggleSelect,
}: {
  task: Task
  onViewDetails: (task: Task) => void
  isSelected: boolean
  onToggleSelect: (taskId: string) => void
}) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"
  const canBeSelected = task.status !== "completed" && task.status !== "cancelled"

  return (
    <Card
      className={`group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:scale-[1.02] ${
        isOverdue ? "ring-2 ring-red-200 dark:ring-red-800" : ""
      } ${isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {canBeSelected && (
              <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(task.id)} className="mt-1" />
            )}
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-50 pr-4 line-clamp-2">
                {task.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {task.assignment?.client?.name || "No client"}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</span>
            <span
              className={`text-sm ${isOverdue ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-900 dark:text-gray-50"}`}
            >
              {task.dueDate ? formatDate(task.dueDate) : "Not set"}
            </span>
          </div>
          {task.category && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</span>
              <Badge variant="outline" className="text-xs">
                {task.category.name}
              </Badge>
            </div>
          )}
          {task.templateSiteAsset && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Asset</span>
              <span className="text-sm text-gray-900 dark:text-gray-50 truncate max-w-32">
                {task.templateSiteAsset.name}
              </span>
            </div>
          )}
          {task.performanceRating && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating</span>
              {getPerformanceRatingBadge(task.performanceRating)}
            </div>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(task)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Task List View Component
function TaskListView({
  tasks,
  onViewDetails,
  selectedTasks,
  onToggleSelect,
  onToggleSelectAll,
}: {
  tasks: Task[]
  onViewDetails: (task: Task) => void
  selectedTasks: string[]
  onToggleSelect: (taskId: string) => void
  onToggleSelectAll: () => void
}) {
  const selectableTasks = tasks.filter((task) => task.status !== "completed" && task.status !== "cancelled")
  const allSelectableSelected =
    selectableTasks.length > 0 && selectableTasks.every((task) => selectedTasks.includes(task.id))
  const someSelected = selectedTasks.length > 0

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
            <TableHead className="w-12">
              {selectableTasks.length > 0 && (
                <Checkbox
                  checked={allSelectableSelected}
                  onCheckedChange={onToggleSelectAll}
                  className={someSelected && !allSelectableSelected ? "data-[state=checked]:bg-blue-600" : ""}
                />
              )}
            </TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Task</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Client</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Priority</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Due Date</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Rating</TableHead>
            <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Activity className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-50">No tasks found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"
              const canBeSelected = task.status !== "completed" && task.status !== "cancelled"
              const isSelected = selectedTasks.includes(task.id)

              return (
                <TableRow
                  key={task.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 ${
                    isOverdue ? "bg-red-50/50 dark:bg-red-900/10" : ""
                  } ${isSelected ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                >
                  <TableCell>
                    {canBeSelected && <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(task.id)} />}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-50 line-clamp-1">{task.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {task.category?.name || "No category"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.assignment?.client?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{task.assignment?.client?.name?.charAt(0) || "N"}</AvatarFallback>
                      </Avatar>
                      <span className="text-gray-900 dark:text-gray-50">
                        {task.assignment?.client?.name || "No client"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    <span
                      className={`text-sm ${isOverdue ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-900 dark:text-gray-50"}`}
                    >
                      {task.dueDate ? formatDate(task.dueDate) : "Not set"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {task.performanceRating ? (
                      getPerformanceRatingBadge(task.performanceRating)
                    ) : (
                      <span className="text-gray-400 text-sm">Not rated</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewDetails(task)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                        {task.completionLink && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <a
                                href={task.completionLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer"
                              >
                                <LinkIcon className="mr-2 h-4 w-4" />
                                View Completion
                              </a>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// Floating Action Bar Component
function FloatingActionBar({
  selectedCount,
  onStatusUpdate,
  onClearSelection,
}: {
  selectedCount: number
  onStatusUpdate: () => void
  onClearSelection: () => void
}) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg px-6 py-3 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {selectedCount} task{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onClearSelection} className="rounded-full bg-transparent">
            Clear
          </Button>
          <Button onClick={onStatusUpdate} size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">
            <Check className="w-4 h-4 mr-2" />
            Update Status
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AgentTaskDashboard({ agentId }: { agentId: string | undefined }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    cancelled: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/tasks/agents/${agentId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: AgentTasksResponse = await response.json()
      setTasks(data.tasks)
      setStats(data.stats)
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks.")
      console.error("Failed to fetch tasks:", err)
      toast.error(err.message || "Failed to fetch tasks. Please try again.", {
        description: "Error fetching tasks",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      const response = await fetch(`/api/tasks/agents/${agentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, ...updates }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const updatedTask = await response.json()
      // Update the task in the local state
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)))
      // Refresh stats
      await fetchTasks()
    } catch (err: any) {
      console.error("Failed to update task:", err)
      throw err
    }
  }

  const handleUpdateSelectedTasks = async (action: "completed" | "pending", completionLink?: string) => {
    setIsUpdating(true)
    try {
      let successCount = 0
      let errorCount = 0

      // Update each selected task individually using the existing route
      for (const taskId of selectedTasks) {
        try {
          const updates: any = { status: action }
          if (action === "completed" && completionLink) {
            updates.completionLink = completionLink
          }
          await handleUpdateTask(taskId, updates)
          successCount++
        } catch (error) {
          errorCount++
          console.error(`Failed to update task ${taskId}:`, error)
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully updated ${successCount} task${successCount !== 1 ? "s" : ""} to ${action === "completed" ? "completed" : "pending"}`,
        )
      }

      if (errorCount > 0) {
        toast.error(`Failed to update ${errorCount} task${errorCount !== 1 ? "s" : ""}`)
      }

      // Clear selection and refresh tasks
      setSelectedTasks([])
      await fetchTasks()
    } catch (err: any) {
      console.error("Failed to update tasks:", err)
      toast.error("Failed to update tasks. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setIsDetailsDialogOpen(true)
  }

  const handleToggleSelect = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleToggleSelectAll = () => {
    const selectableTasks = filteredTasks.filter((task) => task.status !== "completed" && task.status !== "cancelled")
    const allSelected = selectableTasks.every((task) => selectedTasks.includes(task.id))

    if (allSelected) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(selectableTasks.map((task) => task.id))
    }
  }

  const handleClearSelection = () => {
    setSelectedTasks([])
  }

  const handleStatusUpdate = () => {
    setIsStatusModalOpen(true)
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignment?.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.templateSiteAsset?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const selectedTaskObjects = tasks.filter((task) => selectedTasks.includes(task.id))

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
  const overdueCount = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed",
  ).length

  useEffect(() => {
    if (agentId) {
      fetchTasks()
    }
  }, [agentId])

  if (!agentId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-fit mx-auto">
            <Activity className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-yellow-600 dark:text-yellow-400">Agent ID Required</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Please ensure you are properly authenticated</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-fit mx-auto">
            <Activity className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-red-600 dark:text-red-400">Error: {error}</p>
            <Button onClick={fetchTasks} className="bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-8 pb-20">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Manage and track your assigned tasks</p>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total Tasks</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-blue-100 mt-1">All assigned tasks</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Completed</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-white">{stats.completed}</div>
            <p className="text-xs text-emerald-100 mt-1">{completionRate}% completion rate</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">In Progress</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <Play className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-white">{stats.inProgress}</div>
            <p className="text-xs text-amber-100 mt-1">Currently working on</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-100">Overdue</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-white">{overdueCount}</div>
            <p className="text-xs text-red-100 mt-1">Need immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Management Card */}
      <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <List className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">Task Management</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                  Search, filter, and manage your assigned tasks
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </div>
        <CardContent className="p-6">
          {/* Enhanced Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search tasks by name, client, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`h-12 w-12 rounded-xl ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <List className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === "card" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("card")}
                  className={`h-12 w-12 rounded-xl ${
                    viewMode === "card"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tasks Display */}
          {viewMode === "list" ? (
            <TaskListView
              tasks={filteredTasks}
              onViewDetails={handleViewDetails}
              selectedTasks={selectedTasks}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTasks.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <Activity className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-50">No tasks found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onViewDetails={handleViewDetails}
                    isSelected={selectedTasks.includes(task.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))
              )}
            </div>
          )}

          {/* Enhanced Results Summary */}
          {filteredTasks.length > 0 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-gray-50">{filteredTasks.length}</span> of{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-50">{tasks.length}</span> tasks
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Bar */}
      <FloatingActionBar
        selectedCount={selectedTasks.length}
        onStatusUpdate={handleStatusUpdate}
        onClearSelection={handleClearSelection}
      />

      {/* Task Details Dialog */}
      <TaskDetailsDialog
        task={selectedTask}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        onUpdateTask={handleUpdateTask}
      />

      {/* Task Status Update Modal */}
      <TaskStatusModal
        isOpen={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        selectedTasks={selectedTaskObjects}
        onUpdateTasks={handleUpdateSelectedTasks}
        isUpdating={isUpdating}
      />
    </div>
  )
}
