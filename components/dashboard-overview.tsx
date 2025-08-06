"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Users,
  Layers,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Import data from data folder
import {
  recentActivity,
  topPerformers,
  projectStatusData,
  teamWorkloadData,
  teamEfficiencyData,
  clientSatisfactionData,
  revenuePackageData,
  weeklyTaskStatusData,
} from "@/data/dashboard-data";

export function SimpleOverviewDashboard() {
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">Dashboard Overview</h2>

        <div className="flex gap-3 items-center">
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Export Data
            </Button>
            <Button size="sm">Generate Report</Button>
          </div>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Clients"
          value="128"
          change="+12%"
          trend="up"
          description="vs previous period"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Projects"
          value="87"
          change="+5%"
          trend="up"
          description="vs previous period"
          icon={<Layers className="h-5 w-5" />}
        />
        <MetricCard
          title="Tasks Completed"
          value="1,483"
          change="+18%"
          trend="up"
          description="vs previous period"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <MetricCard
          title="Team Members"
          value="42"
          change="+3"
          trend="up"
          description="new this month"
          icon={<UserCheck className="h-5 w-5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Monthly Client Engagement
            </CardTitle>
            <CardDescription>
              Number of active clients and projects per month
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Client engagement has increased by 15% over the last quarter
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  82 active clients in December
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Task Completion Trends
            </CardTitle>
            <CardDescription>Weekly task status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6 mt-4">
              {weeklyTaskStatusData.map((week) => (
                <div key={week.week} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{week.week}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {week.completed} Completed
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {week.inProgress} In Progress
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {week.pending} Pending
                      </span>
                    </div>
                  </div>
                  <Progress value={week.completed} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Project Status Distribution
            </CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="text-sm font-medium">
                    {projectStatusData.completed}%
                  </span>
                </div>
                <Progress value={projectStatusData.completed} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">In Progress</span>
                  </div>
                  <span className="text-sm font-medium">
                    {projectStatusData.inProgress}%
                  </span>
                </div>
                <Progress
                  value={projectStatusData.inProgress}
                  className="h-2 bg-secondary [&>div]:bg-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="text-sm font-medium">
                    {projectStatusData.pending}%
                  </span>
                </div>
                <Progress
                  value={projectStatusData.pending}
                  className="h-2 bg-secondary [&>div]:bg-amber-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Team Workload
            </CardTitle>
            <CardDescription>Tasks assigned per team</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {teamWorkloadData.map((team) => (
                <div key={team.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{team.name}</span>
                    <span className="text-sm font-medium">
                      {team.tasks} Tasks
                    </span>
                  </div>
                  <Progress
                    value={
                      (team.tasks /
                        Math.max(...teamWorkloadData.map((t) => t.tasks))) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest actions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar} alt={activity.user} />
                    <AvatarFallback>
                      {activity.user.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user}{" "}
                      <span className="text-muted-foreground font-normal">
                        {activity.action}
                      </span>{" "}
                      {activity.item}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 max-w-xl">
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
          <TabsTrigger value="clients">Client Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Top Performers
                </CardTitle>
                <CardDescription>
                  Team members with most completed tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer) => (
                    <div
                      key={performer.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={performer.avatar}
                            alt={performer.name}
                          />
                          <AvatarFallback>
                            {performer.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{performer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {performer.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700"
                        >
                          {performer.completed} Tasks
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Team Efficiency
                </CardTitle>
                <CardDescription>
                  Average time to complete tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  {teamEfficiencyData.map((item) => (
                    <div
                      key={item.team}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item.team} Team</span>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        {item.days} days avg.
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Client Retention
                </CardTitle>
                <CardDescription>Monthly client retention rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">94%</div>
                    <p className="text-muted-foreground">
                      Average retention rate
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Retention has improved by 2% this quarter
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Client Satisfaction
                </CardTitle>
                <CardDescription>
                  Average rating by service category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  {clientSatisfactionData.map((item) => (
                    <div key={item.service} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.service}</span>
                        <span className="text-sm font-medium">
                          {item.rating}/5.0
                        </span>
                      </div>
                      <Progress
                        value={(item.rating / 5) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Monthly Revenue
                </CardTitle>
                <CardDescription>
                  Revenue trends over the past year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">$824,500</div>
                    <p className="text-muted-foreground">
                      Total revenue this year
                    </p>
                    <div className="flex items-center justify-center mt-4">
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700"
                      >
                        +18% <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Badge>
                      <span className="text-sm text-muted-foreground ml-2">
                        vs last year
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Revenue by Package
                </CardTitle>
                <CardDescription>
                  Distribution of revenue across packages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenuePackageData.map((pkg) => (
                    <div key={pkg.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${pkg.color}`}
                          ></div>
                          <span className="text-sm">{pkg.name}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {pkg.value}%
                        </span>
                      </div>
                      <Progress
                        value={pkg.value}
                        className={`h-2 bg-secondary [&>div]:${pkg.color}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
  icon: React.ReactNode;
}

function MetricCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
          <Badge
            variant="outline"
            className={
              trend === "up"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }
          >
            {change}{" "}
            {trend === "up" ? <ArrowUpRight className="h-3 w-3 ml-1" /> : null}
          </Badge>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-4">{description}</p>
      </CardContent>
    </Card>
  );
}
