"use client"

import { useState, useCallback, useEffect } from "react"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Activity,
  List,
  Grid,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react"
import Link from "next/link"

interface Agent {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  category: string
  address: string
  bio: string
  status: "active" | "inactive" | "pending"
  createdAt: string
  image?: string
  role?: string
}

// Enhanced status badges with better colors
const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
          <UserCheck className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700">
          <UserX className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// Enhanced category badge
const getCategoryBadge = (category: string) => {
  const colors = {
    "Social Team":
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    "Asset Team":
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    "Marketing Team":
      "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800",
    "Development Team":
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  }

  const colorClass = colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"

  return (
    <Badge className={`${colorClass} font-medium`}>
      <Briefcase className="w-3 h-3 mr-1" />
      {category}
    </Badge>
  )
}

// Helper function for date formatting
const formatJoinDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Enhanced Agent Details Dialog
function AgentDetailsDialog({
  agent,
  isOpen,
  onOpenChange,
}: {
  agent: Agent | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!agent) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage src={agent.image || "/placeholder.svg"} alt={`${agent.firstName} ${agent.lastName}`} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                {agent.firstName.charAt(0)}
                {agent.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {agent.firstName} {agent.lastName}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {agent.email}
              </DialogDescription>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(agent.status)}
              {getCategoryBadge(agent.category)}
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-500" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
                  <p className="text-gray-900 dark:text-gray-50">{agent.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Join Date</p>
                  <p className="text-gray-900 dark:text-gray-50">{formatJoinDate(agent.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address */}
          {agent.address && (
            <>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-500" />
                  Address
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-gray-900 dark:text-gray-50">{agent.address}</p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Biography */}
          {agent.bio && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-500" />
                Biography
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{agent.bio}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Enhanced Agent Card Component
function AgentCard({
  agent,
  onDelete,
  onViewDetails,
}: {
  agent: Agent
  onDelete: (id: string) => void
  onViewDetails: (agent: Agent) => void
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarImage src={agent.image || "/placeholder.svg"} alt={`${agent.firstName} ${agent.lastName}`} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                {agent.firstName.charAt(0)}
                {agent.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-50">
                {agent.firstName} {agent.lastName}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {agent.email}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(agent.status)}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</span>
            {getCategoryBadge(agent.category)}
          </div>

          {agent.phone && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</span>
              <span className="text-sm text-gray-900 dark:text-gray-50 flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {agent.phone}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Joined</span>
            <span className="text-sm text-gray-900 dark:text-gray-50 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatJoinDate(agent.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onViewDetails(agent)} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit Agent
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Agent
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the agent "{agent.firstName}{" "}
                      {agent.lastName}" and remove all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(agent.id)} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced Agent List View Component
function AgentListView({
  agents,
  onDelete,
  onViewDetails,
}: {
  agents: Agent[]
  onDelete: (id: string) => void
  onViewDetails: (agent: Agent) => void
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [agentToDeleteId, setAgentToDeleteId] = useState<string | null>(null)

  const confirmDelete = (agentId: string) => {
    setAgentToDeleteId(agentId)
    setIsDeleteDialogOpen(true)
  }

  const executeDelete = () => {
    if (agentToDeleteId) {
      onDelete(agentToDeleteId)
      setIsDeleteDialogOpen(false)
      setAgentToDeleteId(null)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Agent</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Category</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Contact</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Join Date</TableHead>
            <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-50">No agents found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow
                key={agent.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800"
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                      <AvatarImage
                        src={agent.image || "/placeholder.svg"}
                        alt={`${agent.firstName} ${agent.lastName}`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                        {agent.firstName.charAt(0)}
                        {agent.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-50">
                        {agent.firstName} {agent.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {agent.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(agent.category)}</TableCell>
                <TableCell>
                  {agent.phone ? (
                    <div className="flex items-center text-gray-900 dark:text-gray-50">
                      <Phone className="w-3 h-3 mr-1 text-gray-400" />
                      {agent.phone}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Not provided</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(agent.status)}</TableCell>
                <TableCell className="text-sm text-gray-900 dark:text-gray-50">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                    {formatJoinDate(agent.createdAt)}
                  </div>
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
                      <DropdownMenuItem onClick={() => onViewDetails(agent)} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Agent
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog
                        open={isDeleteDialogOpen && agentToDeleteId === agent.id}
                        onOpenChange={setIsDeleteDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onSelect={(e) => {
                              e.preventDefault()
                              confirmDelete(agent.id)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Agent
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the agent "{agent.firstName}{" "}
                              {agent.lastName}" and remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={executeDelete} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default function AllAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const fetchAgents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/agents")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Agent[] = await response.json()
      setAgents(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch agents.")
      console.error("Failed to fetch agents:", err)
      toast.error(err.message || "Failed to fetch agents. Please try again.", {
        description: "Error fetching agents",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const response = await fetch("/api/agents", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: agentId }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setAgents((prevAgents) => prevAgents.filter((agent) => agent.id !== agentId))
      toast.success("The agent has been successfully removed.", {
        description: "Agent Deleted",
      })
    } catch (err: any) {
      console.error("Failed to delete agent:", err)
      toast.error(err.message || "Failed to delete agent. Please try again.", {
        description: "Error deleting agent",
      })
    }
  }

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsDetailsDialogOpen(true)
  }

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter
    const matchesCategory = categoryFilter === "all" || agent.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalAgents = agents.length
  const activeAgents = agents.filter((a) => a.status === "active").length
  const pendingAgents = agents.filter((a) => a.status === "pending").length
  const activePercentage = totalAgents > 0 ? Math.round((activeAgents / totalAgents) * 100) : 0

  const uniqueCategories = Array.from(new Set(agents.map((agent) => agent.category))).filter(Boolean)

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading agents...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-fit mx-auto">
              <Users className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-red-600 dark:text-red-400">Error: {error}</p>
              <Button onClick={fetchAgents} className="bg-blue-600 hover:bg-blue-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col space-y-8">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                All Agents
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage and monitor all agents in your organization
              </p>
            </div>
            <Link href="/admin/agents/create">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-base">
                <Plus className="h-5 w-5" />
                Add New Agent
              </Button>
            </Link>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Total Agents</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white">{totalAgents}</div>
                <p className="text-xs text-blue-100 mt-1">Total agents in the system</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-100">Active Agents</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white">{activeAgents}</div>
                <p className="text-xs text-emerald-100 mt-1">{activePercentage}% of total</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-100">Pending Approval</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white">{pendingAgents}</div>
                <p className="text-xs text-amber-100 mt-1">Require attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Management Card */}
          <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                      Agent Management
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                      Search, filter, and manage all agents in your organization
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
                    placeholder="Search agents by name, email, or category..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] h-12 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
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

              {/* Agents Display */}
              {viewMode === "list" ? (
                <AgentListView agents={filteredAgents} onDelete={handleDeleteAgent} onViewDetails={handleViewDetails} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAgents.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-900 dark:text-gray-50">No agents found</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    filteredAgents.map((agent) => (
                      <AgentCard
                        key={agent.id}
                        agent={agent}
                        onDelete={handleDeleteAgent}
                        onViewDetails={handleViewDetails}
                      />
                    ))
                  )}
                </div>
              )}

              {/* Enhanced Results Summary */}
              {filteredAgents.length > 0 && (
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-gray-900 dark:text-gray-50">{filteredAgents.length}</span> of{" "}
                    <span className="font-semibold text-gray-900 dark:text-gray-50">{agents.length}</span> agents
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="border-gray-200 dark:border-gray-700 text-gray-400 bg-transparent"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="border-gray-200 dark:border-gray-700 text-gray-400 bg-transparent"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Agent Details Dialog */}
        <AgentDetailsDialog agent={selectedAgent} isOpen={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} />
      </div>
    </div>
  )
}
