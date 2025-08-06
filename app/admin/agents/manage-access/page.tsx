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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Shield,
  Users,
  Lock,
  Unlock,
  Edit,
  Plus,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

// Mock data for agents with access control
const mockAgents = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "Senior Agent",
    department: "Sales",
    status: "active",
    permissions: {
      dashboard: { read: true, write: true, delete: false },
      projects: { read: true, write: true, delete: true },
      users: { read: true, write: false, delete: false },
      reports: { read: true, write: true, delete: false },
      settings: { read: false, write: false, delete: false },
      billing: { read: false, write: false, delete: false },
    },
    accessGroups: ["sales_team", "senior_agents"],
    lastAccess: "2024-01-15T10:30:00Z",
    ipRestrictions: ["192.168.1.0/24"],
    mfaEnabled: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@company.com",
    role: "Agent",
    department: "Support",
    status: "active",
    permissions: {
      dashboard: { read: true, write: false, delete: false },
      projects: { read: true, write: true, delete: false },
      users: { read: true, write: false, delete: false },
      reports: { read: true, write: false, delete: false },
      settings: { read: false, write: false, delete: false },
      billing: { read: false, write: false, delete: false },
    },
    accessGroups: ["support_team"],
    lastAccess: "2024-01-15T09:45:00Z",
    ipRestrictions: [],
    mfaEnabled: false,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@company.com",
    role: "Lead Agent",
    department: "Marketing",
    status: "active",
    permissions: {
      dashboard: { read: true, write: true, delete: false },
      projects: { read: true, write: true, delete: true },
      users: { read: true, write: true, delete: false },
      reports: { read: true, write: true, delete: false },
      settings: { read: true, write: false, delete: false },
      billing: { read: false, write: false, delete: false },
    },
    accessGroups: ["marketing_team", "lead_agents"],
    lastAccess: "2024-01-14T14:20:00Z",
    ipRestrictions: [],
    mfaEnabled: true,
  },
];

const accessGroups = [
  {
    id: "sales_team",
    name: "Sales Team",
    description: "Access to sales-related features",
    memberCount: 8,
  },
  {
    id: "support_team",
    name: "Support Team",
    description: "Customer support access",
    memberCount: 12,
  },
  {
    id: "marketing_team",
    name: "Marketing Team",
    description: "Marketing tools and analytics",
    memberCount: 6,
  },
  {
    id: "senior_agents",
    name: "Senior Agents",
    description: "Enhanced permissions for senior staff",
    memberCount: 4,
  },
  {
    id: "lead_agents",
    name: "Lead Agents",
    description: "Team leadership permissions",
    memberCount: 3,
  },
];

const permissionModules = [
  {
    key: "dashboard",
    name: "Dashboard",
    description: "Main dashboard and overview",
  },
  {
    key: "projects",
    name: "Projects",
    description: "Project management and tracking",
  },
  { key: "users", name: "Users", description: "User account management" },
  { key: "reports", name: "Reports", description: "Analytics and reporting" },
  { key: "settings", name: "Settings", description: "System configuration" },
  {
    key: "billing",
    name: "Billing",
    description: "Billing and subscription management",
  },
];

export default function ManageAccessPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || agent.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const updateAgentPermission = (
    agentId: string,
    module: string,
    permission: string,
    value: boolean
  ) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            permissions: {
              ...agent.permissions,
              [module]: {
                ...agent.permissions[module as keyof typeof agent.permissions],
                [permission]: value,
              },
            },
          };
        }
        return agent;
      })
    );
  };

  const toggleMFA = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          return { ...agent, mfaEnabled: !agent.mfaEnabled };
        }
        return agent;
      })
    );
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getPermissionLevel = (permissions: any) => {
    const totalPermissions = Object.values(permissions).reduce(
      (acc: number, module: any) => {
        return acc + Object.values(module).filter(Boolean).length;
      },
      0
    );

    if (totalPermissions >= 15)
      return { level: "Full Access", color: "bg-red-100 text-red-800" };
    if (totalPermissions >= 10)
      return { level: "High Access", color: "bg-yellow-100 text-yellow-800" };
    if (totalPermissions >= 5)
      return { level: "Medium Access", color: "bg-blue-100 text-blue-800" };
    return { level: "Limited Access", color: "bg-gray-100 text-gray-800" };
  };

  const getSecurityScore = (agent: any) => {
    let score = 0;
    if (agent.mfaEnabled) score += 30;
    if (agent.ipRestrictions.length > 0) score += 20;
    if (agent.status === "active") score += 10;

    const permissionLevel = getPermissionLevel(agent.permissions);
    if (permissionLevel.level === "Limited Access") score += 40;
    else if (permissionLevel.level === "Medium Access") score += 30;
    else if (permissionLevel.level === "High Access") score += 20;
    else score += 10;

    return Math.min(score, 100);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Access Control
          </h1>
          <p className="text-muted-foreground">
            Configure permissions, access groups, and security settings for
            agents
          </p>
        </div>

        {showSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Access settings have been updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="permissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="access-groups">Access Groups</TabsTrigger>
            <TabsTrigger value="security">Security Settings</TabsTrigger>
          </TabsList>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Agent Permissions Management
                </CardTitle>
                <CardDescription>
                  Configure detailed permissions for each agent across different
                  modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search agents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-6">
                  {filteredAgents.map((agent) => {
                    const permissionLevel = getPermissionLevel(
                      agent.permissions
                    );
                    const securityScore = getSecurityScore(agent);

                    return (
                      <div key={agent.id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{agent.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {agent.email}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{agent.role}</Badge>
                                <Badge variant="outline">
                                  {agent.department}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge className={permissionLevel.color}>
                              {permissionLevel.level}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              Security Score: {securityScore}%
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                          {permissionModules.map((module) => {
                            const modulePermissions =
                              agent.permissions[
                                module.key as keyof typeof agent.permissions
                              ];
                            return (
                              <div
                                key={module.key}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="font-medium">
                                      {module.name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                      {module.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {Object.entries(modulePermissions).map(
                                    ([permission, value]) => (
                                      <div
                                        key={permission}
                                        className="flex items-center justify-between"
                                      >
                                        <Label
                                          htmlFor={`${agent.id}-${module.key}-${permission}`}
                                          className="text-sm capitalize"
                                        >
                                          {permission}
                                        </Label>
                                        <Switch
                                          id={`${agent.id}-${module.key}-${permission}`}
                                          checked={value as boolean}
                                          onCheckedChange={(checked) =>
                                            updateAgentPermission(
                                              agent.id,
                                              module.key,
                                              permission,
                                              checked
                                            )
                                          }
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Groups Tab */}
          <TabsContent value="access-groups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Access Groups Management
                </CardTitle>
                <CardDescription>
                  Organize agents into groups with predefined permission sets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {accessGroups.map((group) => (
                    <div key={group.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{group.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {group.description}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {group.memberCount} members
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm">
                          <span className="font-medium">
                            Members in this group:
                          </span>
                          <div className="mt-2 space-y-1">
                            {agents
                              .filter((agent) =>
                                agent.accessGroups.includes(group.id)
                              )
                              .map((agent) => (
                                <div
                                  key={agent.id}
                                  className="flex items-center justify-between p-2 bg-muted rounded"
                                >
                                  <span className="text-sm">{agent.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setAgents((prev) =>
                                        prev.map((a) =>
                                          a.id === agent.id
                                            ? {
                                                ...a,
                                                accessGroups:
                                                  a.accessGroups.filter(
                                                    (g) => g !== group.id
                                                  ),
                                              }
                                            : a
                                        )
                                      );
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Group
                          </Button>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure advanced security features for agent accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredAgents.map((agent) => {
                    const securityScore = getSecurityScore(agent);

                    return (
                      <div key={agent.id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{agent.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {agent.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                Security Score
                              </div>
                              <div
                                className={`text-lg font-bold ${
                                  securityScore >= 80
                                    ? "text-green-600"
                                    : securityScore >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {securityScore}%
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <div>
                                  <div className="font-medium">
                                    Multi-Factor Authentication
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {agent.mfaEnabled ? "Enabled" : "Disabled"}
                                  </div>
                                </div>
                              </div>
                              <Switch
                                checked={agent.mfaEnabled}
                                onCheckedChange={() => toggleMFA(agent.id)}
                              />
                            </div>

                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-3 mb-3">
                                <Lock className="h-5 w-5 text-purple-600" />
                                <div>
                                  <div className="font-medium">
                                    IP Restrictions
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {agent.ipRestrictions.length > 0
                                      ? `${agent.ipRestrictions.length} restriction(s)`
                                      : "No restrictions"}
                                  </div>
                                </div>
                              </div>
                              {agent.ipRestrictions.length > 0 && (
                                <div className="space-y-1">
                                  {agent.ipRestrictions.map((ip, index) => (
                                    <div
                                      key={index}
                                      className="text-sm font-mono bg-muted p-2 rounded"
                                    >
                                      {ip}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add IP Restriction
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-3 mb-3">
                                <Info className="h-5 w-5 text-green-600" />
                                <div>
                                  <div className="font-medium">Last Access</div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(
                                      agent.lastAccess
                                    ).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-3 mb-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                <div>
                                  <div className="font-medium">
                                    Account Status
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {agent.status === "active"
                                      ? "Active"
                                      : "Inactive"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Lock className="h-4 w-4 mr-2" />
                                  Lock Account
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Unlock className="h-4 w-4 mr-2" />
                                  Reset Password
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
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
