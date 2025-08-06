// "use client"

// import { useState } from "react"
// import { CheckCircle, X } from "lucide-react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { format } from "date-fns"
// import { toast } from "sonner"
// import type { Client } from "@/types/client"

// interface ClientEditModalProps {
//   isOpen: boolean
//   onOpenChange: (open: boolean) => void
//   client: Client
//   setClient: (client: Client) => void
//   refreshClients?: () => void // optional to refresh parent list after update
// }

// export function ClientEditModal({ isOpen, onOpenChange, client, setClient, refreshClients }: ClientEditModalProps) {
//   const [loading, setLoading] = useState(false)

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!client) return
//     try {
//       setLoading(true)
//       const response = await fetch(`/api/clients/${client.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...client,
//           socialLinks: client.socialLinks.map((link) => ({
//             id: link.id?.toString().startsWith("new-") ? undefined : link.id,
//             platform: link.platform,
//             url: link.url,
//           })),
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to update client")

//       const updatedClient: Client = await response.json()
//       setClient(updatedClient)
//       toast.success("Client updated successfully")

//       // Optionally refresh the client list in parent
//       if (refreshClients) refreshClients()

//       onOpenChange(false)
//     } catch (error) {
//       console.error("Error updating client:", error)
//       toast.error("Failed to update client")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl h-[calc(100vh-10rem)] overflow-y-auto">
//         <form onSubmit={handleFormSubmit}>
//           <DialogHeader>
//             <DialogTitle>Edit Client</DialogTitle>
//             <DialogDescription>Update the client information below</DialogDescription>
//           </DialogHeader>

//           {/* --- form fields (unchanged from your code) --- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input id="name" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
//               </div>
//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   value={client.email || ""}
//                   onChange={(e) => setClient({ ...client, email: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="birthdate">Birthdate</Label>
//                 <Input
//                   id="birthdate"
//                   type="date"
//                   value={client.birthdate ? format(new Date(client.birthdate), "yyyy-MM-dd") : ""}
//                   onChange={(e) => setClient({ ...client, birthdate: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="company">Company</Label>
//                 <Input
//                   id="company"
//                   value={client.company || ""}
//                   onChange={(e) => setClient({ ...client, company: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="designation">Designation</Label>
//                 <Input
//                   id="designation"
//                   value={client.designation || ""}
//                   onChange={(e) => setClient({ ...client, designation: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="location">Location</Label>
//                 <Input
//                   id="location"
//                   value={client.location || ""}
//                   onChange={(e) => setClient({ ...client, location: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   value={client.phone || ""}
//                   onChange={(e) => setClient({ ...client, phone: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="website">Personal Website</Label>
//                 <Input
//                   id="website"
//                   value={client.website || ""}
//                   onChange={(e) => setClient({ ...client, website: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="website2">Website 2</Label>
//                 <Input
//                   id="website2"
//                   value={client.website2 || ""}
//                   onChange={(e) => setClient({ ...client, website2: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="website3">Website 3</Label>
//                 <Input
//                   id="website3"
//                   value={client.website3 || ""}
//                   onChange={(e) => setClient({ ...client, website3: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="companywebsite">Company Website</Label>
//                 <Input
//                   id="companywebsite"
//                   value={client.companywebsite || ""}
//                   onChange={(e) => setClient({ ...client, companywebsite: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="companyaddress">Company Address</Label>
//                 <Input
//                   id="companyaddress"
//                   value={client.companyaddress || ""}
//                   onChange={(e) => setClient({ ...client, companyaddress: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="status">Status</Label>
//                 <Select value={client.status || ""} onValueChange={(value) => setClient({ ...client, status: value })}>
//                   <SelectTrigger id="status">
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="inactive">Inactive</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="category">Category</Label>
//                 <Input
//                   id="category"
//                   value={client.category || ""}
//                   onChange={(e) => setClient({ ...client, category: e.target.value })}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* --- More fields: startDate, dueDate, packageId, progress, etc. --- */}
//           <div className="mt-6 space-y-4">
//             <div>
//               <Label htmlFor="startDate">Start Date</Label>
//               <Input
//                 id="startDate"
//                 type="date"
//                 value={client.startDate ? format(new Date(client.startDate), "yyyy-MM-dd") : ""}
//                 onChange={(e) =>
//                   setClient({
//                     ...client,
//                     startDate: e.target.value ? new Date(e.target.value).toISOString() : null,
//                   })
//                 }
//               />
//             </div>
//             <div>
//               <Label htmlFor="dueDate">Due Date</Label>
//               <Input
//                 id="dueDate"
//                 type="date"
//                 value={client.dueDate ? format(new Date(client.dueDate), "yyyy-MM-dd") : ""}
//                 onChange={(e) =>
//                   setClient({
//                     ...client,
//                     dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
//                   })
//                 }
//               />
//             </div>
//             <div>
//               <Label htmlFor="packageId">Package ID</Label>
//               <Input
//                 id="packageId"
//                 value={client.packageId || ""}
//                 onChange={(e) => setClient({ ...client, packageId: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="progress">Progress (%)</Label>
//               <Input
//                 id="progress"
//                 type="number"
//                 min="0"
//                 max="100"
//                 value={client.progress || 0}
//                 onChange={(e) => setClient({ ...client, progress: Number.parseInt(e.target.value) || 0 })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="imageDrivelink">Image Drive Link</Label>
//               <Input
//                 id="imageDrivelink"
//                 value={client.imageDrivelink || ""}
//                 onChange={(e) => setClient({ ...client, imageDrivelink: e.target.value })}
//                 placeholder="https://drive.google.com/drive/folders/..."
//               />
//             </div>
//           </div>

//           <div className="mt-6">
//             <Label htmlFor="address">Address</Label>
//             <Input
//               id="address"
//               value={client.address || ""}
//               onChange={(e) => setClient({ ...client, address: e.target.value })}
//             />
//           </div>

//           <div className="mt-6">
//             <Label htmlFor="biography">Biography</Label>
//             <Textarea
//               id="biography"
//               value={client.biography || ""}
//               onChange={(e) => setClient({ ...client, biography: e.target.value })}
//               rows={4}
//             />
//           </div>

//           {/* --- Social Links --- */}
//           <div className="mt-6">
//             <Label>Social Links</Label>
//             <div className="space-y-3 mt-2">
//               {client.socialLinks.map((link, index) => (
//                 <div key={link.id} className="flex gap-2">
//                   <Input
//                     placeholder="Platform (e.g., Facebook)"
//                     value={link.platform}
//                     onChange={(e) => {
//                       const newLinks = [...client.socialLinks]
//                       newLinks[index].platform = e.target.value
//                       setClient({ ...client, socialLinks: newLinks })
//                     }}
//                   />
//                   <Input
//                     placeholder="URL"
//                     value={link.url}
//                     onChange={(e) => {
//                       const newLinks = [...client.socialLinks]
//                       newLinks[index].url = e.target.value
//                       setClient({ ...client, socialLinks: newLinks })
//                     }}
//                   />
//                   <Button
//                     type="button"
//                     variant="destructive"
//                     size="icon"
//                     onClick={() => {
//                       const newLinks = [...client.socialLinks]
//                       newLinks.splice(index, 1)
//                       setClient({ ...client, socialLinks: newLinks })
//                     }}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   setClient({
//                     ...client,
//                     socialLinks: [
//                       ...client.socialLinks,
//                       {
//                         id: `new-${Date.now()}`,
//                         platform: "",
//                         url: "",
//                         clientId: client.id,
//                       },
//                     ],
//                   })
//                 }}
//               >
//                 Add Social Link
//               </Button>
//             </div>
//           </div>

//           <DialogFooter className="mt-6">
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading}>
//               <CheckCircle className="h-4 w-4 mr-2" /> {loading ? "Saving..." : "Save Changes"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { toast } from "sonner"
import type { Client } from "@/types/client"

interface ClientEditModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  client: Client
  setClient: (client: Client) => void
  refreshClients: () => Promise<void> // ✅ added to refresh client list after update
}

export function ClientEditModal({ isOpen, onOpenChange, client, setClient, refreshClients }: ClientEditModalProps) {
  const [saving, setSaving] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...client,
          socialLinks: client.socialLinks.map((link) => ({
            platform: link.platform,
            url: link.url,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to update client")

      const updatedClient: Client = await response.json()
      setClient(updatedClient)
      toast.success("Client updated successfully")

      // ✅ refresh the list so ClientGrid/ClientList shows latest data
      await refreshClients()

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating client:", error)
      toast.error("Failed to update client")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[calc(100vh-10rem)] overflow-y-auto">
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update the client information below</DialogDescription>
          </DialogHeader>

          {/* --- Form Fields --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={client.email || ""}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="birthdate">Birthdate</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={client.birthdate ? format(new Date(client.birthdate), "yyyy-MM-dd") : ""}
                  onChange={(e) => setClient({ ...client, birthdate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={client.company || ""}
                  onChange={(e) => setClient({ ...client, company: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={client.designation || ""}
                  onChange={(e) => setClient({ ...client, designation: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={client.location || ""}
                  onChange={(e) => setClient({ ...client, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={client.phone || ""}
                  onChange={(e) => setClient({ ...client, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="companywebsite">Company Website</Label>
                <Input
                  id="companywebsite"
                  value={client.companywebsite || ""}
                  onChange={(e) => setClient({ ...client, companywebsite: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="companyaddress">Company Address</Label>
                <Input
                  id="companyaddress"
                  value={client.companyaddress || ""}
                  onChange={(e) => setClient({ ...client, companyaddress: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={client.status || ""}
                  onValueChange={(value) => setClient({ ...client, status: value })}
                >
                  <SelectTrigger id="status">
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
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={client.category || ""}
                  onChange={(e) => setClient({ ...client, category: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Dates & Package */}
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={client.startDate ? format(new Date(client.startDate), "yyyy-MM-dd") : ""}
                onChange={(e) =>
                  setClient({ ...client, startDate: e.target.value ? new Date(e.target.value).toISOString() : null })
                }
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={client.dueDate ? format(new Date(client.dueDate), "yyyy-MM-dd") : ""}
                onChange={(e) =>
                  setClient({ ...client, dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })
                }
              />
            </div>
            <div>
              <Label htmlFor="packageId">Package ID</Label>
              <Input
                id="packageId"
                value={client.packageId || ""}
                onChange={(e) => setClient({ ...client, packageId: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={client.progress || 0}
                onChange={(e) => setClient({ ...client, progress: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-6">
            <Label>Social Links</Label>
            <div className="space-y-3 mt-2">
              {client.socialLinks.map((link, index) => (
                <div key={link.id || index} className="flex gap-2">
                  <Input
                    placeholder="Platform"
                    value={link.platform}
                    onChange={(e) => {
                      const newLinks = [...client.socialLinks]
                      newLinks[index].platform = e.target.value
                      setClient({ ...client, socialLinks: newLinks })
                    }}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...client.socialLinks]
                      newLinks[index].url = e.target.value
                      setClient({ ...client, socialLinks: newLinks })
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      const newLinks = [...client.socialLinks]
                      newLinks.splice(index, 1)
                      setClient({ ...client, socialLinks: newLinks })
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
                onClick={() =>
                  setClient({
                    ...client,
                    socialLinks: [
                      ...client.socialLinks,
                      { id: `new-${Date.now()}`, platform: "", url: "", clientId: client.id },
                    ],
                  })
                }
              >
                Add Social Link
              </Button>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
