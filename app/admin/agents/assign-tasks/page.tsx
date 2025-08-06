"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Users, FolderOpen, CheckCircle, Minus } from "lucide-react";

// Mock data
const mockAgents = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    department: "Sales",
    role: "Senior Agent",
    projectsCount: 12,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@company.com",
    department: "Support",
    role: "Agent",
    projectsCount: 8,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@company.com",
    department: "Marketing",
    role: "Lead Agent",
    projectsCount: 15,
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@company.com",
    department: "Sales",
    role: "Agent",
    projectsCount: 6,
  },
];

const mockProjects = [
  {
    id: "1",
    name: "E-commerce Platform",
    status: "active",
    priority: "high",
    assignedAgents: 3,
    deadline: "2024-02-15",
  },
  {
    id: "2",
    name: "Mobile App Development",
    status: "active",
    priority: "medium",
    assignedAgents: 2,
    deadline: "2024-03-01",
  },
  {
    id: "3",
    name: "Customer Portal",
    status: "completed",
    priority: "low",
    assignedAgents: 4,
    deadline: "2024-01-30",
  },
  {
    id: "4",
    name: "Analytics Dashboard",
    status: "active",
    priority: "high",
    assignedAgents: 1,
    deadline: "2024-02-28",
  },
  {
    id: "5",
    name: "Marketing Campaign",
    status: "pending",
    priority: "medium",
    assignedAgents: 0,
    deadline: "2024-03-15",
  },
];

const mockAssignments = [
  { agentId: "1", projectId: "1", role: "Lead", assignedDate: "2024-01-10" },
  {
    agentId: "1",
    projectId: "2",
    role: "Developer",
    assignedDate: "2024-01-15",
  },
  { agentId: "2", projectId: "1", role: "Support", assignedDate: "2024-01-12" },
  { agentId: "3", projectId: "3", role: "Lead", assignedDate: "2024-01-05" },
];

export default function AssignProjectsPage() {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignments, setAssignments] = useState(mockAssignments);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAgentAssignments = (agentId: string) => {
    return assignments
      .filter((a) => a.agentId === agentId)
      .map((a) => {
        const project = mockProjects.find((p) => p.id === a.projectId);
        return { ...a, projectName: project?.name || "Unknown Project" };
      });
  };

  const getProjectAssignments = (projectId: string) => {
    return assignments
      .filter((a) => a.projectId === projectId)
      .map((a) => {
        const agent = mockAgents.find((ag) => ag.id === a.agentId);
        return { ...a, agentName: agent?.name || "Unknown Agent" };
      });
  };

  const handleBulkAssign = () => {
    if (!selectedAgent || selectedProjects.length === 0) return;

    const newAssignments = selectedProjects.map((projectId) => ({
      agentId: selectedAgent,
      projectId,
      role: "Developer",
      assignedDate: new Date().toISOString().split("T")[0],
    }));

    setAssignments((prev) => [...prev, ...newAssignments]);
    setSelectedProjects([]);
    setSelectedAgent("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleRemoveAssignment = (agentId: string, projectId: string) => {
    setAssignments((prev) =>
      prev.filter((a) => !(a.agentId === agentId && a.projectId === projectId))
    );
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Low
          </Badge>
        );
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assign Projects</h1>
          <p className="text-muted-foreground">
            Manage project assignments for agents in your organization
          </p>
        </div>

        {showSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Projects have been successfully assigned to the selected agent!
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="bulk-assign" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bulk-assign">Bulk Assignment</TabsTrigger>
            <TabsTrigger value="current-assignments">
              Current Assignments
            </TabsTrigger>
            <TabsTrigger value="project-overview">Project Overview</TabsTrigger>
          </TabsList>

          {/* Bulk Assignment Tab */}
          <TabsContent value="bulk-assign" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Bulk Project Assignment
                </CardTitle>
                <CardDescription>
                  Select an agent and assign multiple projects at once
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Agent Selection */}
                <div className="space-y-2">
                  <Label>Select Agent</Label>
                  <Select
                    value={selectedAgent}
                    onValueChange={setSelectedAgent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an agent to assign projects to" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAgents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{agent.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {agent.department}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Project Search */}
                <div className="space-y-2">
                  <Label>Search Projects</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search projects by name or status..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Projects Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Available Projects</Label>
                    <div className="text-sm text-muted-foreground">
                      {selectedProjects.length} selected
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Select</TableHead>
                          <TableHead>Project Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Assigned Agents</TableHead>
                          <TableHead>Deadline</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedProjects.includes(project.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedProjects((prev) => [
                                      ...prev,
                                      project.id,
                                    ]);
                                  } else {
                                    setSelectedProjects((prev) =>
                                      prev.filter((id) => id !== project.id)
                                    );
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {project.name}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(project.status)}
                            </TableCell>
                            <TableCell>
                              {getPriorityBadge(project.priority)}
                            </TableCell>
                            <TableCell>
                              {project.assignedAgents} agents
                            </TableCell>
                            <TableCell>
                              {new Date(project.deadline).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Assignment Summary */}
                {selectedAgent && selectedProjects.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-medium">Assignment Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      Assigning {selectedProjects.length} project(s) to{" "}
                      {mockAgents.find((a) => a.id === selectedAgent)?.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProjects.map((projectId) => {
                        const project = mockProjects.find(
                          (p) => p.id === projectId
                        );
                        return project ? (
                          <Badge key={projectId} variant="outline">
                            {project.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedAgent("");
                      setSelectedProjects([]);
                    }}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    onClick={handleBulkAssign}
                    disabled={!selectedAgent || selectedProjects.length === 0}
                  >
                    Assign Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Current Assignments Tab */}
          <TabsContent value="current-assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Project Assignments</CardTitle>
                <CardDescription>
                  View and manage existing project assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockAgents.map((agent) => {
                    const agentAssignments = getAgentAssignments(agent.id);
                    return (
                      <div key={agent.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{agent.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {agent.department} • {agent.role}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {agentAssignments.length} projects
                          </Badge>
                        </div>

                        {agentAssignments.length > 0 ? (
                          <div className="space-y-2">
                            {agentAssignments.map((assignment) => (
                              <div
                                key={`${assignment.agentId}-${assignment.projectId}`}
                                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">
                                      {assignment.projectName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Role: {assignment.role} • Assigned:{" "}
                                      {new Date(
                                        assignment.assignedDate
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveAssignment(
                                      assignment.agentId,
                                      assignment.projectId
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No projects assigned to this agent
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Overview Tab */}
          <TabsContent value="project-overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Assignment Overview</CardTitle>
                <CardDescription>
                  View assignments from a project perspective
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockProjects.map((project) => {
                    const projectAssignments = getProjectAssignments(
                      project.id
                    );
                    return (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FolderOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{project.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(project.status)}
                                {getPriorityBadge(project.priority)}
                                <span className="text-sm text-muted-foreground">
                                  Due:{" "}
                                  {new Date(
                                    project.deadline
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {projectAssignments.length} agents
                          </Badge>
                        </div>

                        {projectAssignments.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {projectAssignments.map((assignment) => (
                              <div
                                key={`${assignment.agentId}-${assignment.projectId}`}
                                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">
                                      {assignment.agentName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {assignment.role}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveAssignment(
                                      assignment.agentId,
                                      assignment.projectId
                                    )
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No agents assigned to this project
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
