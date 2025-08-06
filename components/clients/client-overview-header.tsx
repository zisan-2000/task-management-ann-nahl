"use client"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface ClientOverviewHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  packageFilter: string
  setPackageFilter: (pkg: string) => void
  packageTypes: string[]
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  onAddNewClient: () => void
}

export function ClientOverviewHeader({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  packageFilter,
  setPackageFilter,
  packageTypes,
  viewMode,
  setViewMode,
  onAddNewClient,
}: ClientOverviewHeaderProps) {
  return (
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
              <SelectItem key={pkg} value={pkg}>
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
          onClick={onAddNewClient}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </div>
    </div>
  )
}
