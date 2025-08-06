"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Calendar,
  CheckCircle,
  Users,
  FileText,
  Plus,
  MessageSquare,
  AlertTriangle,
  CheckCheck,
  Eye,
  X,
  Edit,
  Trash2,
  Globe,
  Clock,
  Link,
  User,
  Briefcase,
  MapPin,
  Cake,
  Package,
  Shield,
  ListChecks,
  BarChart2,
  Flag,
  Mail,
  Phone,
  Home,
  BookOpen,
  Image,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { Client } from "@/types/client"
import { Separator } from "@/components/ui/separator"


type TaskStatusCounts = {
  pending: number
  in_progress: number
  completed: number
  overdue: number
  cancelled: number
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [packageFilter, setPackageFilter] = useState("all")
  const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personalInfo: true,
    projectTimeline: true,
    taskSummary: true,
    teamMembers: true,
    assignments: true,
    socialLinks: true,
    biography: true,
    companyInfo: true,
  })

  const fetchClients = useCallback(async () => {
    try {
      const response = await fetch("/api/clients")
      if (!response.ok) {
        throw new Error("Failed to fetch clients")
      }
      const data: Client[] = await response.json()
      setClients(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching clients:", error)
      toast.error("Failed to load clients data.")
      setLoading(false)
    }
  }, [])

  const fetchClientDetails = useCallback(async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch client details")
      }
      const data: Client = await response.json()
      setSelectedClient(data)
    } catch (error) {
      console.error("Error fetching client details:", error)
      toast.error("Failed to load client details.")
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleDelete = async () => {
    if (!selectedClient) return
    try {
      await fetch(`/api/clients/${selectedClient.id}`, {
        method: "DELETE",
      })
      setClients(clients.filter((client) => client.id !== selectedClient.id))
      setSelectedClient(null)
      setDeleteConfirm(false)
      toast.success("Client deleted successfully")
    } catch (error) {
      console.error("Error deleting client:", error)
      toast.error("Failed to delete client")
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) return
    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...selectedClient,
          socialLinks: selectedClient.socialLinks.map((link) => ({
            platform: link.platform,
            url: link.url,
          })),
        }),
      })
      if (response.ok) {
        const updatedClient = await response.json()
        setClients(clients.map((client) => (client.id === updatedClient.id ? updatedClient : client)))
        setEditMode(false)
        toast.success("Client updated successfully")
      }
    } catch (error) {
      console.error("Error updating client:", error)
      toast.error("Failed to update client")
    }
  }

  const handleViewClientDetails = async (client: Client) => {
    setSelectedClient(client)
    setIsClientDetailsModalOpen(true)
    await fetchClientDetails(client.id)
  }

  const handleAddNewClient = () => {
    router.push("clients/onboarding")
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const filteredClients = clients.filter((client) => {
    if (statusFilter !== "all" && client.status !== statusFilter) {
      return false
    }
    if (packageFilter !== "all" && client.packageId !== packageFilter) {
      return false
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        client.name.toLowerCase().includes(query) ||
        client.company?.toLowerCase().includes(query) ||
        client.designation?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query)
      )
    }
    return true
  })

  const packageTypes = Array.from(new Set(clients.map((client) => client.packageId).filter(Boolean)))

  const getTaskStatusCounts = (tasks: Client['tasks'] = []): TaskStatusCounts => {
    return {
      pending: tasks.filter(t => t.status === 'pending').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => t.status === 'overdue').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 md:px-6">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Client Overview</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients..."
                className="pl-9 w-[250px] border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] border-gray-200 focus:border-cyan-500 focus:ring-cyan-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={packageFilter} onValueChange={setPackageFilter}>
              <SelectTrigger className="w-[150px] border-gray-200 focus:border-cyan-500 focus:ring-cyan-500">
                <SelectValue placeholder="Filter by package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                {packageTypes.map((pkg) => (
                  <SelectItem key={pkg} value={pkg!}>
                    {pkg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "grid" | "list")}
              className="hidden md:block"
            >
              <TabsList className="h-10 bg-gray-100 rounded-lg p-1">
                <TabsTrigger
                  value="grid"
                  className="px-4 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all"
                >
                  <div className="grid grid-cols-3 gap-0.5 h-4 w-4">
                    {Array(9)
                      .fill(null)
                      .map((_, i) => (
                        <div key={i} className="bg-current rounded-sm"></div>
                      ))}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="px-4 py-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all"
                >
                  <div className="flex flex-col gap-0.5 h-4 w-4">
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <div key={i} className="bg-current rounded-sm h-1"></div>
                      ))}
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md rounded-lg px-5 py-2.5 transition-all duration-300"
              onClick={handleAddNewClient}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2 font-medium">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></div>
              <span>Pending: {clients.filter((c) => c.status === "pending").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm"></div>
              <span>Active: {clients.filter((c) => c.status === "active").length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400 shadow-sm"></div>
              <span>Inactive: {clients.filter((c) => c.status === "inactive").length}</span>
            </div>
          </div>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg border border-gray-100">
          <p className="text-lg font-medium mb-2">No clients found matching your criteria.</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onViewDetails={() => handleViewClientDetails(client)}
              onEdit={() => {
                setSelectedClient(client)
                setEditMode(true)
              }}
              onDelete={() => {
                setSelectedClient(client)
                setDeleteConfirm(true)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-[1.5fr_auto_auto_auto_auto_auto] p-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-700">
            <div>Client</div>
            <div className="text-center w-28">Status</div>
            <div className="text-center w-28">Package</div>
            <div className="text-center w-28">Start Date</div>
            <div className="text-center w-28">Progress</div>
            <div className="text-center w-28">Actions</div>
          </div>
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="grid grid-cols-[1.5fr_auto_auto_auto_auto_auto] p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-gray-100 shadow-sm">
                  <AvatarImage
                    src={
                      client.avatar ||
                      `/placeholder.svg?height=60&width=60&text=${client.name.substring(0, 2) || "/placeholder.svg"}`
                    }
                    alt={client.name}
                  />
                  <AvatarFallback className="bg-cyan-100 text-cyan-700 font-bold">
                    {client.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-800">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.company}</p>
                  <p className="text-xs text-gray-500">{client.designation}</p>
                </div>
              </div>
              <div className="text-center w-28">
                <Badge
                  className={
                    client.status === "active"
                      ? "bg-emerald-100 text-emerald-800 font-medium px-3 py-1 rounded-full"
                      : client.status === "inactive"
                        ? "bg-gray-100 text-gray-800 font-medium px-3 py-1 rounded-full"
                        : "bg-amber-100 text-amber-800 font-medium px-3 py-1 rounded-full"
                  }
                >
                  {client.status || "Pending"}
                </Badge>
              </div>
              <div className="text-center w-28">
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 font-medium border-gray-200 px-3 py-1 rounded-full"
                >
                  {client.packageId || "None"}
                </Badge>
              </div>
              <div className="text-center w-28 text-sm text-gray-600 font-medium">
                {client.startDate ? new Date(client.startDate).toLocaleDateString() : "-"}
              </div>
              <div className="w-28 px-2">
                <div className="flex items-center gap-2">
                  <Progress value={client.progress || 0} className="h-2 w-full bg-gray-200" />
                  <span className="text-sm font-medium text-gray-700">{client.progress || 0}%</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 w-28">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                  onClick={() => handleViewClientDetails(client)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => {
                    setSelectedClient(client)
                    setEditMode(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => {
                    setSelectedClient(client)
                    setDeleteConfirm(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <Dialog open={isClientDetailsModalOpen} onOpenChange={setIsClientDetailsModalOpen}>
          <DialogContent className="max-w-6xl p-6 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b border-gray-100 mb-4">
              <DialogTitle className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                <Avatar className="h-16 w-16 border-4 border-cyan-200 shadow-md">
                  <AvatarImage
                    src={
                      selectedClient.avatar ||
                      `/placeholder.svg?height=80&width=80&text=${selectedClient.name.substring(0, 2) || "/placeholder.svg"}`
                    }
                    alt={selectedClient.name}
                  />
                  <AvatarFallback className="bg-cyan-100 text-cyan-700 text-2xl font-bold">
                    {selectedClient.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  {selectedClient.name}
                  <DialogDescription className="text-gray-600 text-base mt-1">
                    {selectedClient.company} • {selectedClient.designation}
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Personal Information */}
              <Collapsible
                open={expandedSections.personalInfo}
                onOpenChange={() => toggleSection('personalInfo')}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <User className="h-5 w-5 text-cyan-600" /> Personal Information
                  </h3>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {expandedSections.personalInfo ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {selectedClient.birthdate && (
                      <div className="flex items-center gap-3">
                        <Cake className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Birthdate</p>
                          <p className="font-medium">
                            {format(new Date(selectedClient.birthdate), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedClient.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-medium">{selectedClient.location}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <Badge
                          className={
                            selectedClient.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : selectedClient.status === "inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-amber-100 text-amber-800"
                          }
                        >
                          {selectedClient.status || "Pending"}
                        </Badge>
                      </div>
                    </div>
                    {selectedClient.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="font-medium">{selectedClient.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium">{selectedClient.email}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.address && (
                      <div className="flex items-center gap-3">
                        <Home className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="font-medium">{selectedClient.address}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.category && (
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="font-medium">{selectedClient.category}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Project Timeline */}
              <Collapsible
                open={expandedSections.projectTimeline}
                onOpenChange={() => toggleSection('projectTimeline')}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-cyan-600" /> Project Timeline
                  </h3>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {expandedSections.projectTimeline ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {selectedClient.startDate && (
                      <div className="flex items-center gap-3">
                        <Flag className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="font-medium">
                            {format(new Date(selectedClient.startDate), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedClient.dueDate && (
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Due Date</p>
                          <p className="font-medium">
                            {format(new Date(selectedClient.dueDate), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Package</p>
                        <p className="font-medium">
                          {selectedClient.package?.name || selectedClient.packageId || "None"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Task Summary */}
              <Collapsible
                open={expandedSections.taskSummary}
                onOpenChange={() => toggleSection('taskSummary')}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-cyan-600" /> Task Summary
                  </h3>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {expandedSections.taskSummary ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="mt-4">
                    {selectedClient.tasks && selectedClient.tasks.length > 0 ? (
                      <>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 font-medium">Completion Rate</span>
                          <span className="font-medium text-gray-800">
                            {selectedClient.progress || 0}%
                          </span>
                        </div>
                        <Progress value={selectedClient.progress || 0} className="h-3 bg-gray-200 mb-4" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {Object.entries(getTaskStatusCounts(selectedClient.tasks)).map(([status, count]) => (
                            <div
                              key={status}
                              className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 capitalize">
                                  {status.replace('_', ' ')}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={
                                    status === 'completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : status === 'in_progress'
                                        ? 'bg-blue-100 text-blue-800'
                                        : status === 'pending'
                                          ? 'bg-amber-100 text-amber-800'
                                          : status === 'overdue'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {count}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium text-gray-800 mb-3">Recent Tasks</h4>
                          <div className="space-y-2">
                            {selectedClient.tasks.slice(0, 5).map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
                              >
                                <div>
                                  <p className="font-medium">{task.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {task.templateSiteAsset?.type} • {task.templateSiteAsset?.name}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    task.status === 'completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : task.status === 'in_progress'
                                        ? 'bg-blue-100 text-blue-800'
                                        : task.status === 'pending'
                                          ? 'bg-amber-100 text-amber-800'
                                          : task.status === 'overdue'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {task.status.replace('_', ' ')}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm">No tasks assigned to this client yet.</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Team Members */}
              <Collapsible
                open={expandedSections.teamMembers}
                onOpenChange={() => toggleSection('teamMembers')}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-cyan-600" /> Team Members
                    {selectedClient.teamMembers && (
                      <span className="text-sm font-normal text-gray-500">
                        ({selectedClient.teamMembers.length})
                      </span>
                    )}
                  </h3>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {expandedSections.teamMembers ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="mt-4">
                    {selectedClient.teamMembers && selectedClient.teamMembers.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedClient.teamMembers.map((member) => (
                          <div
                            key={member.agentId}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
                          >
                            <Avatar className="h-10 w-10 border border-gray-100">
                              <AvatarImage src={member.agent?.image || "/placeholder.svg"} alt={member.agent?.name || ""} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                {member.agent?.name?.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{member.agent?.name}</p>
                              <p className="text-xs text-gray-600">{member.agent?.role?.name || member.role}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                  {member.team?.name || 'No Team'}
                                </Badge>
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                  {member.assignedTasks || 0} assigned
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No team members assigned to this client yet.</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Assignments */}
              <Collapsible
                open={expandedSections.assignments}
                onOpenChange={() => toggleSection('assignments')}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-cyan-600" /> Assignments
                    {selectedClient.assignments && (
                      <span className="text-sm font-normal text-gray-500">
                        ({selectedClient.assignments.length})
                      </span>
                    )}
                  </h3>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {expandedSections.assignments ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="mt-4">
                    {selectedClient.assignments && selectedClient.assignments.length > 0 ? (
                      <div className="space-y-4">
                        {selectedClient.assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800">
                                {assignment.template?.name || 'Unnamed Assignment'}
                              </h4>
                              <Badge variant="outline" className="px-2 py-0.5 text-xs">
                                {assignment.status || 'Unknown Status'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {assignment.template?.description || 'No description available'}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Assigned At</p>
                                <p className="text-sm font-medium">
                                  {assignment.assignedAt
                                    ? format(new Date(assignment.assignedAt), "MMM d, yyyy")
                                    : 'Not specified'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Tasks</p>
                                <p className="text-sm font-medium">
                                  {assignment.tasks?.length || 0} tasks
                                </p>
                              </div>
                            </div>
                            {assignment.template?.sitesAssets && assignment.template.sitesAssets.length > 0 && (
                              <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">Assets</p>
                                <div className="flex flex-wrap gap-2">
                                  {assignment.template.sitesAssets.map((asset) => (
                                    <Badge
                                      key={asset.id}
                                      variant="outline"
                                      className="text-xs px-2 py-0.5 capitalize"
                                    >
                                      {asset.type.replace('_', ' ')}: {asset.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No assignments for this client yet.</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Company Information */}
              {(selectedClient.companywebsite || selectedClient.companyaddress) && (
                <Collapsible
                  open={expandedSections.companyInfo}
                  onOpenChange={() => toggleSection('companyInfo')}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-cyan-600" /> Company Information
                    </h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        {expandedSections.companyInfo ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {selectedClient.companywebsite && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Website</p>
                            <a
                              href={selectedClient.companywebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-cyan-600 hover:underline"
                            >
                              {selectedClient.companywebsite}
                            </a>
                          </div>
                        </div>
                      )}
                      {selectedClient.companyaddress && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="font-medium">{selectedClient.companyaddress}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Social Links */}
              {selectedClient.socialLinks.length > 0 && (
                <Collapsible
                  open={expandedSections.socialLinks}
                  onOpenChange={() => toggleSection('socialLinks')}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      <Link className="h-5 w-5 text-cyan-600" /> Social Links
                      <span className="text-sm font-normal text-gray-500">
                        ({selectedClient.socialLinks.length})
                      </span>
                    </h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        {expandedSections.socialLinks ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {selectedClient.socialLinks.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
                        >
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
                            {link.platform === 'Facebook' && (
                              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                              </svg>
                            )}
                            {link.platform === 'Twitter' && (
                              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                            )}
                            {link.platform === 'LinkedIn' && (
                              <svg className="h-5 w-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                            )}
                            {!['Facebook', 'Twitter', 'LinkedIn'].includes(link.platform) && (
                              <Link className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{link.platform}</p>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-cyan-600 hover:underline truncate"
                            >
                              {link.url}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Biography */}
              {selectedClient.biography && (
                <Collapsible
                  open={expandedSections.biography}
                  onOpenChange={() => toggleSection('biography')}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-cyan-600" /> Biography
                    </h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        {expandedSections.biography ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="mt-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                      <p className="text-gray-700 whitespace-pre-line">{selectedClient.biography}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Image Drive Link */}
              {selectedClient.imageDrivelink && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-3">
                    <Image className="h-5 w-5 text-cyan-600" /> Image Drive Link
                  </h3>
                  <a
                    href={selectedClient.imageDrivelink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:underline text-sm"
                  >
                    {selectedClient.imageDrivelink}
                  </a>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(true)
                  setIsClientDetailsModalOpen(false)
                }}
                className="mr-2"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Client
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setDeleteConfirm(true)
                  setIsClientDetailsModalOpen(false)
                }}
                className="mr-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button variant="outline" onClick={() => setIsClientDetailsModalOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Modal */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="max-w-4xl h-[calc(100vh-10rem)] overflow-y-auto">
          {selectedClient && (
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Edit Client</DialogTitle>
                <DialogDescription>Update the client information below</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={selectedClient.name}
                      onChange={(e) => setSelectedClient({ ...selectedClient, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={selectedClient.email || ""}
                      onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Birthdate</Label>
                    <Input
                      type="date"
                      value={selectedClient.birthdate ? format(new Date(selectedClient.birthdate), "yyyy-MM-dd") : ""}
                      onChange={(e) => setSelectedClient({ ...selectedClient, birthdate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={selectedClient.company || ""}
                      onChange={(e) => setSelectedClient({ ...selectedClient, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Designation</Label>
                    <Input
                      value={selectedClient.designation || ""}
                      onChange={(e) => setSelectedClient({ ...selectedClient, designation: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={selectedClient.location || ""}
                      onChange={(e) => setSelectedClient({ ...selectedClient, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={selectedClient.phone || ""}
                      onChange={(e) => setSelectedClient({ ...selectedClient, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Personal Website</Label>
                    <Input
                      value={selectedClient.website || ""}
                      onChange={(e) => setSelectedClient({ ...selectedClient, website: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Website 2</Label>
                    <Input
                      value={selectedClient.website2 || ""}
                      onChange={(e) => setSelectedClient({ ...selectedClient, website2: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Website 3</Label>
                    <Input
                      value={selectedClient.website3 || ""}
                      onChange={(e) => setSelectedClient({ ...selectedClient, website3: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Company Website</Label>
                    <Input
                      value={selectedClient.companywebsite || ""}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          companywebsite: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Company Address</Label>
                    <Input
                      value={selectedClient.companyaddress || ""}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          companyaddress: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={selectedClient.status || ""}
                      onValueChange={(value) => setSelectedClient({ ...selectedClient, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={selectedClient.category || ""}
                      onChange={(e) => setSelectedClient({ ...selectedClient, category: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={selectedClient.startDate ? format(new Date(selectedClient.startDate), "yyyy-MM-dd") : ""}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        startDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={selectedClient.dueDate ? format(new Date(selectedClient.dueDate), "yyyy-MM-dd") : ""}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Package ID</Label>
                  <Input
                    value={selectedClient.packageId || ""}
                    onChange={(e) => setSelectedClient({ ...selectedClient, packageId: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Progress (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedClient.progress || 0}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        progress: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Image Drive Link</Label>
                  <Input
                    value={selectedClient.imageDrivelink || ""}
                    onChange={(e) => setSelectedClient({ ...selectedClient, imageDrivelink: e.target.value })}
                    placeholder="https://drive.google.com/drive/folders/..."
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label>Address</Label>
                <Input
                  value={selectedClient.address || ""}
                  onChange={(e) => setSelectedClient({ ...selectedClient, address: e.target.value })}
                />
              </div>

              <div className="mt-6">
                <Label>Biography</Label>
                <Textarea
                  value={selectedClient.biography || ""}
                  onChange={(e) => setSelectedClient({ ...selectedClient, biography: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="mt-6">
                <Label>Social Links</Label>
                <div className="space-y-3 mt-2">
                  {selectedClient.socialLinks.map((link, index) => (
                    <div key={link.id} className="flex gap-2">
                      <Input
                        placeholder="Platform (e.g., Facebook)"
                        value={link.platform}
                        onChange={(e) => {
                          const newLinks = [...selectedClient.socialLinks]
                          newLinks[index].platform = e.target.value
                          setSelectedClient({ ...selectedClient, socialLinks: newLinks })
                        }}
                      />
                      <Input
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...selectedClient.socialLinks]
                          newLinks[index].url = e.target.value
                          setSelectedClient({ ...selectedClient, socialLinks: newLinks })
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const newLinks = [...selectedClient.socialLinks]
                          newLinks.splice(index, 1)
                          setSelectedClient({ ...selectedClient, socialLinks: newLinks })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedClient({
                        ...selectedClient,
                        socialLinks: [
                          ...selectedClient.socialLinks,
                          {
                            id: `new-${Date.now()}`,
                            platform: "",
                            url: "",
                            clientId: selectedClient.id,
                          },
                        ],
                      })
                    }}
                  >
                    Add Social Link
                  </Button>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <CheckCircle className="h-4 w-4 mr-2" /> Save Changes
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

function ClientCard({
  client,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  client: Client
  onViewDetails: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const taskStatusCounts = {
    pending: client.tasks?.filter(t => t.status === 'pending').length || 0,
    in_progress: client.tasks?.filter(t => t.status === 'in_progress').length || 0,
    completed: client.tasks?.filter(t => t.status === 'completed').length || 0,
    overdue: client.tasks?.filter(t => t.status === 'overdue').length || 0,
    cancelled: client.tasks?.filter(t => t.status === 'cancelled').length || 0,
  }

  const totalTasks = Object.values(taskStatusCounts).reduce((sum, count) => sum + count, 0)
  const hasNewComments = Math.random() > 0.5
  const hasIssues = Math.random() > 0.7

  return (
    <Card className="overflow-hidden rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] bg-white">
      <CardHeader className="p-6 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-md">
              <AvatarImage
                src={
                  client.avatar ||
                  `/placeholder.svg?height=80&width=80&text=${client.name.substring(0, 2) || "/placeholder.svg"}`
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
              Package: {client.packageId || "None"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Overall Progress</span>
            <span className="font-bold text-gray-800">{client.progress || 0}%</span>
          </div>
          <Progress value={client.progress || 0} className="h-2.5 bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-cyan-600" />
              <h3 className="font-semibold text-gray-800">Task Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-gray-600">Total Tasks:</div>
              <div className="font-medium text-gray-800">{totalTasks}</div>
              <div className="text-gray-600">Completed:</div>
              <div className="font-medium text-emerald-700">{taskStatusCounts.completed}</div>
              <div className="text-gray-600">In Progress:</div>
              <div className="font-medium text-blue-700">{taskStatusCounts.in_progress}</div>
              <div className="text-gray-600">Pending:</div>
              <div className="font-medium text-amber-700">{taskStatusCounts.pending}</div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-cyan-600" />
              <h3 className="font-semibold text-gray-800">Timeline</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-gray-600">Start Date:</div>
              <div className="font-medium text-gray-800">
                {client.startDate ? new Date(client.startDate).toLocaleDateString() : "-"}
              </div>
              <div className="text-gray-600">Due Date:</div>
              <div className="font-medium text-gray-800">
                {client.dueDate ? new Date(client.dueDate).toLocaleDateString() : "-"}
              </div>
              <div className="text-gray-600">Team Size:</div>
              <div className="font-medium text-gray-800">{client.teamMembers?.length || 0} members</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          {hasNewComments && (
            <div className="flex items-center gap-1 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              <span>New comments</span>
            </div>
          )}
          {hasIssues && (
            <div className="flex items-center gap-1 text-red-700 bg-red-50 px-3 py-1.5 rounded-full text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              <span>Issues reported</span>
            </div>
          )}
          {!hasIssues && !hasNewComments && (
            <div className="flex items-center gap-1 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium">
              <CheckCheck className="h-4 w-4" />
              <span>No Issues</span>
            </div>
          )}
        </div>
      </CardContent>
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
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            className="hover:bg-red-50 hover:text-red-600 bg-transparent"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}