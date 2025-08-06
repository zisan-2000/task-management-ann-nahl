"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCheck,
  Eye,
  Edit,
  Trash2,
  Package,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

import type { Client, TaskStatusCounts } from "@/types/client"

interface ClientCardProps {
  clientId: string
  onViewDetails: () => void
  onEdit: () => void
}

export function ClientCard({ clientId, onViewDetails, onEdit }: ClientCardProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch full client details from API
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/clients/${clientId}`)
        if (!response.ok) throw new Error("Failed to fetch client")
        const data: Client = await response.json()
        setClient(data)
      } catch (error) {
        console.error("Error fetching client:", error)
        toast.error("Failed to load client details.")
      } finally {
        setLoading(false)
      }
    }
    fetchClient()
  }, [clientId])

  // Compute task status counts
  const getTaskStatusCounts = (tasks: Client["tasks"] = []): TaskStatusCounts => ({
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    cancelled: tasks.filter((t) => t.status === "cancelled").length,
  })

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-cyan-500 rounded-full"></div>
      </Card>
    )
  }

  if (!client) {
    return (
      <Card className="p-6 text-center text-gray-500">
        Failed to load client data
      </Card>
    )
  }

  const taskCounts = getTaskStatusCounts(client.tasks)
  const totalTasks = Object.values(taskCounts).reduce((sum, count) => sum + count, 0)

  return (
    <Card className="overflow-hidden rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] bg-white">
      {/* Header */}
      <CardHeader className="p-6 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-md">
              <AvatarImage
                src={
                  client.avatar ||
                  `/placeholder.svg?height=80&width=80&text=${client.name.substring(0, 2)}`
                }
                alt={client.name}
              />
              <AvatarFallback className="bg-cyan-100 text-cyan-700 text-2xl font-bold">
                {client.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{client.name}</h2>
              <p className="text-gray-600 text-sm">{client.company}</p>
              <p className="text-gray-500 text-xs">{client.designation}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              className={
                client.status === "active"
                  ? "bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1.5 rounded-full"
                  : client.status === "inactive"
                    ? "bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full"
                    : "bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1.5 rounded-full"
              }
            >
              {client.status || "Pending"}
            </Badge>
            <Badge
              variant="outline"
              className="bg-gray-50 text-gray-700 font-medium border-gray-200 px-3 py-1.5 rounded-full"
            >
              <Package className="h-4 w-4 inline-block mr-1 text-cyan-600" />
              {client.package?.name || client.packageId || "No Package"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-6 space-y-5">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Overall Progress</span>
            <span className="font-bold text-gray-800">{client.progress || 0}%</span>
          </div>
          <Progress value={client.progress || 0} className="h-2.5 bg-gray-200" />
        </div>

        {/* Task Summary */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-cyan-600" />
            <h3 className="font-semibold text-gray-800">Task Summary</h3>
          </div>
          {totalTasks > 0 ? (
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-600">Total Tasks:</div>
              <div className="font-medium text-gray-800">{totalTasks}</div>

              <div className="text-gray-600">Completed:</div>
              <div className="font-medium text-emerald-700">{taskCounts.completed}</div>

              <div className="text-gray-600">In Progress:</div>
              <div className="font-medium text-blue-700">{taskCounts.in_progress}</div>

              <div className="text-gray-600">Pending:</div>
              <div className="font-medium text-amber-700">{taskCounts.pending}</div>

              <div className="text-gray-600">Overdue:</div>
              <div className="font-medium text-red-700">{taskCounts.overdue}</div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No tasks assigned</p>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="flex gap-2 w-full">
          <Button
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md rounded-lg px-5 py-2.5 transition-all duration-300"
            onClick={onViewDetails}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
            className="hover:bg-blue-50 hover:text-blue-600 bg-transparent"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
