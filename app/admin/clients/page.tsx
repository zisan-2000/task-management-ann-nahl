"use client"
import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ClientOverviewHeader } from "@/components/clients/client-overview-header"
import { ClientStatusSummary } from "@/components/clients/client-status-summary"
import { ClientGrid } from "@/components/clients/client-grid"
import { ClientList } from "@/components/clients/client-list"
import { ClientDetailsModal } from "@/components/clients/client-details-modal"
import { ClientEditModal } from "@/components/clients/client-edit-modal"
import type { Client } from "@/types/client"

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

  // Fetch all clients
  const fetchClients = useCallback(async () => {
    try {
      const response = await fetch("/api/clients")
      if (!response.ok) throw new Error("Failed to fetch clients")
      const data: Client[] = await response.json()
      setClients(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching clients:", error)
      toast.error("Failed to load clients data.")
      setLoading(false)
    }
  }, [])

  // Fetch a single client by ID
  const fetchClientDetails = useCallback(async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`)
      if (!response.ok) throw new Error("Failed to fetch client details")
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

  const handleViewClientDetails = async (client: Client) => {
    setSelectedClient(client)
    setIsClientDetailsModalOpen(true)
    await fetchClientDetails(client.id)
  }

  const handleAddNewClient = () => {
    router.push("clients/onboarding")
  }

  const filteredClients = clients.filter((client) => {
    if (statusFilter !== "all" && client.status !== statusFilter) return false
    if (packageFilter !== "all" && client.packageId !== packageFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        client.name.toLowerCase().includes(q) ||
        client.company?.toLowerCase().includes(q) ||
        client.designation?.toLowerCase().includes(q) ||
        client.email?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const packageTypes = Array.from(new Set(clients.map((c) => c.packageId).filter(Boolean)))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4 md:px-6">
      {/* Header + Summary */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <ClientOverviewHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          packageFilter={packageFilter}
          setPackageFilter={setPackageFilter}
          packageTypes={packageTypes as string[]}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddNewClient={handleAddNewClient}
        />
        <ClientStatusSummary clients={clients} />
      </div>

      {/* Clients Grid or List */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg border border-gray-100">
          <p className="text-lg font-medium mb-2">No clients found matching your criteria.</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : viewMode === "grid" ? (
        <ClientGrid
          clients={filteredClients}
          onViewDetails={handleViewClientDetails}
          onEdit={(client) => {
            setSelectedClient(client)
            setEditMode(true)
          }}
        />
      ) : (
        <ClientList
          clients={filteredClients}
          onViewDetails={handleViewClientDetails}
          onEdit={(client) => {
            setSelectedClient(client)
            setEditMode(true)
          }}
        />
      )}

      {/* Modals */}
      {selectedClient && (
        <>
          <ClientDetailsModal
            isOpen={isClientDetailsModalOpen}
            onOpenChange={setIsClientDetailsModalOpen}
            client={selectedClient}
            onEdit={() => {
              setEditMode(true)
              setIsClientDetailsModalOpen(false)
            }}
            onDelete={() => {
              setDeleteConfirm(true)
              setIsClientDetailsModalOpen(false)
            }}
          />
          <ClientEditModal
            isOpen={editMode}
            onOpenChange={setEditMode}
            client={selectedClient}
            setClient={setSelectedClient}
            refreshClients={fetchClients} // pass down to refresh list after update
          />
        </>
      )}
    </div>
  )
}
