"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Download,
  CalendarIcon,
  Activity,
  User,
  Settings,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogIn,
  LogOut,
} from "lucide-react";
import { format } from "date-fns";

// Mock activity data
const mockActivities = [
  {
    id: "1",
    agentId: "1",
    agentName: "Sarah Johnson",
    action: "login",
    description: "Logged into the system",
    timestamp: "2024-01-15T10:30:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0",
    status: "success",
    details: { location: "New York, NY" },
  },
  {
    id: "2",
    agentId: "1",
    agentName: "Sarah Johnson",
    action: "project_view",
    description: "Viewed project: E-commerce Platform",
    timestamp: "2024-01-15T10:35:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0",
    status: "success",
    details: { projectId: "proj_123", projectName: "E-commerce Platform" },
  },
  {
    id: "3",
    agentId: "2",
    agentName: "Michael Chen",
    action: "project_edit",
    description: "Updated project status",
    timestamp: "2024-01-15T09:45:00Z",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox 121.0.0.0",
    status: "success",
    details: { projectId: "proj_456", changes: ["status: pending -> active"] },
  },
  {
    id: "4",
    agentId: "3",
    agentName: "Emily Rodriguez",
    action: "user_create",
    description: "Created new user account",
    timestamp: "2024-01-15T08:20:00Z",
    ipAddress: "192.168.1.102",
    userAgent: "Safari 17.2.0",
    status: "success",
    details: { userId: "user_789", userName: "John Doe" },
  },
  {
    id: "5",
    agentId: "2",
    agentName: "Michael Chen",
    action: "login_failed",
    description: "Failed login attempt",
    timestamp: "2024-01-15T07:15:00Z",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox 121.0.0.0",
    status: "failed",
    details: { reason: "Invalid password" },
  },
  {
    id: "6",
    agentId: "4",
    agentName: "David Wilson",
    action: "settings_update",
    description: "Updated account settings",
    timestamp: "2024-01-14T16:30:00Z",
    ipAddress: "192.168.1.103",
    userAgent: "Chrome 120.0.0.0",
    status: "success",
    details: { settings: ["email_notifications", "theme"] },
  },
  {
    id: "7",
    agentId: "1",
    agentName: "Sarah Johnson",
    action: "logout",
    description: "Logged out of the system",
    timestamp: "2024-01-14T18:45:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0",
    status: "success",
    details: { sessionDuration: "8h 15m" },
  },
  {
    id: "8",
    agentId: "3",
    agentName: "Emily Rodriguez",
    action: "project_delete",
    description: "Deleted project: Old Marketing Campaign",
    timestamp: "2024-01-14T14:20:00Z",
    ipAddress: "192.168.1.102",
    userAgent: "Safari 17.2.0",
    status: "success",
    details: {
      projectId: "proj_old_123",
      projectName: "Old Marketing Campaign",
    },
  },
];

const actionTypes = [
  { value: "all", label: "All Actions" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "login_failed", label: "Failed Login" },
  { value: "project_view", label: "Project View" },
  { value: "project_edit", label: "Project Edit" },
  { value: "project_delete", label: "Project Delete" },
  { value: "user_create", label: "User Create" },
  { value: "settings_update", label: "Settings Update" },
];

const agents = [
  { value: "all", label: "All Agents" },
  { value: "1", label: "Sarah Johnson" },
  { value: "2", label: "Michael Chen" },
  { value: "3", label: "Emily Rodriguez" },
  { value: "4", label: "David Wilson" },
];

export default function ActivityLogsPage() {
  const [activities, setActivities] = useState(mockActivities);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.ipAddress.includes(searchTerm);

    const matchesAction =
      actionFilter === "all" || activity.action === actionFilter;
    const matchesAgent =
      agentFilter === "all" || activity.agentId === agentFilter;
    const matchesStatus =
      statusFilter === "all" || activity.status === statusFilter;

    const activityDate = new Date(activity.timestamp);
    const matchesDateRange =
      (!dateRange.from || activityDate >= dateRange.from) &&
      (!dateRange.to || activityDate <= dateRange.to);

    return (
      matchesSearch &&
      matchesAction &&
      matchesAgent &&
      matchesStatus &&
      matchesDateRange
    );
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "login":
        return <LogIn className="h-4 w-4 text-green-600" />;
      case "logout":
        return <LogOut className="h-4 w-4 text-gray-600" />;
      case "login_failed":
        return <LogIn className="h-4 w-4 text-red-600" />;
      case "project_view":
        return <Eye className="h-4 w-4 text-blue-600" />;
      case "project_edit":
        return <Edit className="h-4 w-4 text-yellow-600" />;
      case "project_delete":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case "user_create":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "settings_update":
        return <Settings className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Success
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Warning
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const exportLogs = () => {
    const csvContent = [
      [
        "Timestamp",
        "Agent",
        "Action",
        "Description",
        "Status",
        "IP Address",
      ].join(","),
      ...filteredActivities.map((activity) =>
        [
          new Date(activity.timestamp).toISOString(),
          activity.agentName,
          activity.action,
          activity.description,
          activity.status,
          activity.ipAddress,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Agent Activity Logs
            </h1>
            <p className="text-muted-foreground">
              Monitor and audit all agent activities in your system
            </p>
          </div>
          <Button onClick={exportLogs} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Activities
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activities.length}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Successful Actions
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activities.filter((a) => a.status === "success").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  (activities.filter((a) => a.status === "success").length /
                    activities.length) *
                    100
                )}
                % success rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Attempts
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activities.filter((a) => a.status === "failed").length}
              </div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Agents
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(activities.map((a) => a.agentId)).size}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Monitoring</CardTitle>
            <CardDescription>
              Filter and search through agent activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.value} value={agent.value}>
                      {agent.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} -{" "}
                          {format(dateRange.to, "LLL dd")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Activity Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Activity className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No activities found
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="text-sm">
                          {format(
                            new Date(activity.timestamp),
                            "MMM dd, HH:mm:ss"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {activity.agentName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(activity.action)}
                            <span className="capitalize">
                              {activity.action.replace("_", " ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {activity.description}
                        </TableCell>
                        <TableCell>{getStatusBadge(activity.status)}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {activity.ipAddress}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedActivity(
                                selectedActivity === activity.id
                                  ? null
                                  : activity.id
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Activity Details */}
            {selectedActivity && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                {(() => {
                  const activity = activities.find(
                    (a) => a.id === selectedActivity
                  );
                  if (!activity) return null;

                  return (
                    <div className="space-y-2">
                      <h4 className="font-medium">Activity Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">User Agent:</span>
                          <p className="text-muted-foreground">
                            {activity.userAgent}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Full Timestamp:</span>
                          <p className="text-muted-foreground">
                            {format(new Date(activity.timestamp), "PPpp")}
                          </p>
                        </div>
                        {activity.details && (
                          <div className="md:col-span-2">
                            <span className="font-medium">
                              Additional Details:
                            </span>
                            <pre className="text-muted-foreground mt-1 text-xs bg-background p-2 rounded border">
                              {JSON.stringify(activity.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Results Summary */}
            {filteredActivities.length > 0 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredActivities.length} of {activities.length}{" "}
                  activities
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
