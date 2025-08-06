"use client"
import { useState } from "react"
import {
  Calendar,
  User,
  Briefcase,
  MapPin,
  Cake,
  Package,
  Shield,
  ListChecks,
  Flag,
  Mail,
  Phone,
  Home,
  BookOpen,
  ImageIcon,
  Activity,
  ChevronDown,
  ChevronUp,
  Link,
  Edit,
  Trash2,
  X,
  Users,
  Globe,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { format } from "date-fns"
import type { Client, TaskStatusCounts } from "@/types/client" // Corrected import path

interface ClientDetailsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  client: Client
  onEdit: () => void
  onDelete: () => void
}

export function ClientDetailsModal({ isOpen, onOpenChange, client, onEdit, onDelete }: ClientDetailsModalProps) {
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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getTaskStatusCounts = (tasks: Client["tasks"] = []): TaskStatusCounts => {
    return {
      pending: tasks.filter((t) => t.status === "pending").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      overdue: tasks.filter((t) => t.status === "overdue").length,
      cancelled: tasks.filter((t) => t.status === "cancelled").length,
    }
  }

  const taskCounts = getTaskStatusCounts(client.tasks)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-6 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100 mb-4">
          <DialogTitle className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <Avatar className="h-16 w-16 border-4 border-cyan-200 shadow-md">
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
              {client.name}
              <DialogDescription className="text-gray-600 text-base mt-1">
                {client.company} • {client.designation}
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Personal Information */}
          <Collapsible
            open={expandedSections.personalInfo}
            onOpenChange={() => toggleSection("personalInfo")}
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
                {client.birthdate && (
                  <div className="flex items-center gap-3">
                    <Cake className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Birthdate</p>
                      <p className="font-medium">{format(new Date(client.birthdate), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                )}
                {client.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium">{client.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge
                      className={
                        client.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : client.status === "inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-amber-100 text-amber-800"
                      }
                    >
                      {client.status || "Pending"}
                    </Badge>
                  </div>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{client.email}</p>
                    </div>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-medium">{client.address}</p>
                    </div>
                  </div>
                )}
                {client.category && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="font-medium">{client.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Project Timeline */}
          <Collapsible
            open={expandedSections.projectTimeline}
            onOpenChange={() => toggleSection("projectTimeline")}
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
                {client.startDate && (
                  <div className="flex items-center gap-3">
                    <Flag className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="font-medium">{format(new Date(client.startDate), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                )}
                {client.dueDate && (
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="font-medium">{format(new Date(client.dueDate), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Package</p>
                    <p className="font-medium">{client.package?.name || "None"}</p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Task Summary */}
          <Collapsible
            open={expandedSections.taskSummary}
            onOpenChange={() => toggleSection("taskSummary")}
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
                {client.tasks && client.tasks.length > 0 ? (
                  <>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Completion Rate</span>
                      <span className="font-medium text-gray-800">{client.progress || 0}%</span>
                    </div>
                    <Progress value={client.progress || 0} className="h-3 bg-gray-200 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {Object.entries(taskCounts).map(([status, count]) => (
                        <div key={status} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 capitalize">
                              {status.replace("_", " ")}
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                status === "completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : status === "in_progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : status === "pending"
                                      ? "bg-amber-100 text-amber-800"
                                      : status === "overdue"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
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
                        {client.tasks.slice(0, 5).map((task) => (
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
            onOpenChange={() => toggleSection("teamMembers")}
            className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-600" /> Team Members
                {client.teamMembers && (
                  <span className="text-sm font-normal text-gray-500">({client.teamMembers.length})</span>
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
                {client.teamMembers && client.teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {client.teamMembers.map((member) => (
                      <div
                        key={member.agentId}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
                      >
                        <Avatar className="h-10 w-10 border border-gray-100">
                          <AvatarImage src={member.agent.image || "/placeholder.svg"} alt={member.agent.name || ""} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                            {member.agent.name?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{member.agent.name}</p>
                          <p className="text-xs text-gray-600">{member.agent.role?.name || member.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              {member.teamId || "No Team"}
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
            onOpenChange={() => toggleSection("assignments")}
            className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-cyan-600" /> Assignments
                {client.assignments && (
                  <span className="text-sm font-normal text-gray-500">({client.assignments.length})</span>
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
                {client.assignments && client.assignments.length > 0 ? (
                  <div className="space-y-4">
                    {client.assignments.map((assignment) => (
                      <div key={assignment.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">
                            {assignment.template?.name || "Unnamed Assignment"}
                          </h4>
                          <Badge variant="outline" className="px-2 py-0.5 text-xs">
                            {assignment.status || "Unknown Status"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {assignment.template?.description || "No description available"}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Assigned At</p>
                            <p className="text-sm font-medium">
                              {assignment.assignedAt
                                ? format(new Date(assignment.assignedAt), "MMM d, yyyy")
                                : "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Tasks</p>
                            <p className="text-sm font-medium">{assignment.tasks?.length || 0} tasks</p>
                          </div>
                        </div>
                        {assignment.template?.sitesAssets && assignment.template.sitesAssets.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-2">Assets</p>
                            <div className="flex flex-wrap gap-2">
                              {assignment.template.sitesAssets.map((asset) => (
                                <Badge key={asset.id} variant="outline" className="text-xs px-2 py-0.5 capitalize">
                                  {asset.type.replace("_", " ")}: {asset.name}
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
          {(client.companywebsite || client.companyaddress) && (
            <Collapsible
              open={expandedSections.companyInfo}
              onOpenChange={() => toggleSection("companyInfo")}
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
                  {client.companywebsite && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Website</p>
                        <a
                          href={client.companywebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-cyan-600 hover:underline"
                        >
                          {client.companywebsite}
                        </a>
                      </div>
                    </div>
                  )}
                  {client.companyaddress && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="font-medium">{client.companyaddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Social Links */}
          {client.socialLinks.length > 0 && (
            <Collapsible
              open={expandedSections.socialLinks}
              onOpenChange={() => toggleSection("socialLinks")}
              className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <Link className="h-5 w-5 text-cyan-600" /> Social Links
                  <span className="text-sm font-normal text-gray-500">({client.socialLinks.length})</span>
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
                  {client.socialLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
                        {link.platform === "Facebook" && (
                          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        )}
                        {link.platform === "Twitter" && (
                          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.072 4.072 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        )}
                        {link.platform === "LinkedIn" && (
                          <svg className="h-5 w-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        )}
                        {!["Facebook", "Twitter", "LinkedIn"].includes(link.platform) && (
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
          {client.biography && (
            <Collapsible
              open={expandedSections.biography}
              onOpenChange={() => toggleSection("biography")}
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
                  <p className="text-gray-700 whitespace-pre-line">{client.biography}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Image Drive Link */}
          {client.imageDrivelink && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-3">
                <ImageIcon className="h-5 w-5 text-cyan-600" /> Image Drive Link
              </h3>
              <a
                href={client.imageDrivelink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:underline text-sm"
              >
                {client.imageDrivelink}
              </a>
            </div>
          )}
        </div>
        <DialogFooter className="pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false) // Close details modal
              // Delay setting edit mode to allow details modal to close first
              setTimeout(() => {
                // This will be handled by the parent component's onEdit prop
                // which will set the selectedClient and open the edit modal
                // The parent component (ClientsPage) will pass the correct client to the edit modal
                // based on the selectedClient state.
                // So, we just need to trigger the onEdit callback.
                // The actual state management for editMode and selectedClient is in ClientsPage.
                // This button's onClick should trigger the parent's onEdit.
                // The parent will then set editMode(true) and pass selectedClient to ClientEditModal.
                // The `onEdit` and `onDelete` props are correctly defined and used.
                // The `onOpenChange(false)` closes this modal, and then the `onEdit()` call will open the edit modal.
                // This is a common pattern for modal chaining.
                // The `onEdit` and `onDelete` props are correctly defined and used.
                onEdit()
              }, 0)
            }}
            className="mr-2"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Client
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false) // Close details modal
              setTimeout(() => {
                // Similar to onEdit, trigger the parent's onDelete callback
                // which will set deleteConfirm(true) and pass selectedClient to ClientDeleteConfirmation.
                // The current implementation of onDelete in ClientsPage already does this.
                // So, just call the prop.
                onDelete()
              }, 0)
            }}
            className="mr-2"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
