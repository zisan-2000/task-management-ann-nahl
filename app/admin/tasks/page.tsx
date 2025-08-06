"use client"

import { useEffect, useState, useCallback } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ListChecks,
  Clock,
  Flag,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

type Task = {
  id: string
  name: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "completed" | "overdue" | "cancelled"
  dueDate: string | null
  createdAt: string
  assignedTo?: { id: string; name?: string | null }
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks")
      if (!res.ok) throw new Error("Failed to fetch tasks")
      const data: Task[] = await res.json()
      setTasks(data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleDelete = async () => {
    if (!selectedTask) return
    try {
      await fetch(`/api/tasks/${selectedTask.id}`, { method: "DELETE" })
      setTasks(tasks.filter((t) => t.id !== selectedTask.id))
      setDeleteConfirm(false)
      toast.success("Task deleted successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete task")
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTask) return
    try {
      const res = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedTask),
      })
      if (!res.ok) throw new Error("Failed to update task")
      const updated = await res.json()
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)))
      setEditMode(false)
      toast.success("Task updated successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to update task")
    }
  }

  const filteredTasks = tasks.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 md:px-6">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
        <div className="flex gap-4 flex-wrap items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-9 w-[250px] border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md"
            onClick={() => {
              setSelectedTask({
                id: "new",
                name: "",
                priority: "medium",
                status: "pending",
                dueDate: null,
                createdAt: new Date().toISOString(),
              })
              setEditMode(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg border border-gray-100">
          <p className="text-lg font-medium mb-2">No tasks found.</p>
          <p className="text-sm">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => {
                setSelectedTask(task)
                setEditMode(true)
              }}
              onDelete={() => {
                setSelectedTask(task)
                setDeleteConfirm(true)
              }}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="max-w-lg">
          {selectedTask && (
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>
                  {selectedTask.id === "new" ? "Create Task" : "Edit Task"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={selectedTask.name}
                    onChange={(e) =>
                      setSelectedTask({ ...selectedTask, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={selectedTask.status}
                    onValueChange={(value) =>
                      setSelectedTask({ ...selectedTask, status: value as Task["status"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={selectedTask.priority}
                    onValueChange={(value) =>
                      setSelectedTask({ ...selectedTask, priority: value as Task["priority"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={selectedTask.dueDate ? format(new Date(selectedTask.dueDate), "yyyy-MM-dd") : ""}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedTask.id === "new" ? "Create" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className="overflow-hidden border border-gray-100 shadow-md bg-white hover:shadow-lg transition">
      <CardHeader className="p-4 border-b bg-gradient-to-r from-cyan-50 to-blue-50 flex justify-between">
        <h3 className="font-bold text-lg text-gray-800">{task.name}</h3>
        <Badge
          className={
            task.status === "completed"
              ? "bg-emerald-100 text-emerald-800"
              : task.status === "in_progress"
              ? "bg-blue-100 text-blue-800"
              : task.status === "pending"
              ? "bg-amber-100 text-amber-800"
              : task.status === "overdue"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {task.status.replace("_", " ")}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Flag className="h-4 w-4 text-gray-400" /> Priority:{" "}
          <span className="font-medium capitalize">{task.priority}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" /> Due:{" "}
            {format(new Date(task.dueDate), "MMM d, yyyy")}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4 text-gray-400" /> Assigned:{" "}
          {task.assignedTo?.name || "Unassigned"}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t bg-gray-50 p-3">
        <Button size="icon" variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
