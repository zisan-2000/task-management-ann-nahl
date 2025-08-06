"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, ImageIcon, AlertCircle } from "lucide-react"
import type { StepProps } from "@/types/onboarding"
import { toast } from "sonner"

export function ImageGallery({ formData, updateFormData, onNext, onPrevious }: StepProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const extractFolderId = (url: string) => {
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  const validateDriveLink = async () => {
    if (!formData.imageDrivelink) {
      toast.error("Please enter a Google Drive folder link")
      return
    }

    const folderId = extractFolderId(formData.imageDrivelink)
    if (!folderId) {
      toast.error("Invalid Google Drive folder link format")
      return
    }

    setIsValidating(true)
    try {
      // Note: In a real implementation, you'd need a backend API to handle this
      // due to CORS restrictions with Google Drive API
      toast.success("Drive link validated successfully!")

      // Mock some preview images for demonstration
      const mockImages = [
        "/placeholder.svg?height=200&width=200&text=Image+1",
        "/placeholder.svg?height=200&width=200&text=Image+2",
        "/placeholder.svg?height=200&width=200&text=Image+3",
      ]
      setPreviewImages(mockImages)
    } catch (error) {
      toast.error("Failed to validate Drive link")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Image Gallery</h1>
        <p className="text-gray-500 mt-2">Provide a Google Drive Public folder link your images.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="imageDrivelink">Google Drive Folder Link</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="imageDrivelink"
              value={formData.imageDrivelink || ""}
              onChange={(e) => updateFormData({ imageDrivelink: e.target.value })}
            />
            <Button onClick={validateDriveLink} disabled={isValidating || !formData.imageDrivelink} variant="outline">
              {isValidating ? "Validating..." : "Validate"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Make sure the folder is publicly accessible or shared with appropriate permissions.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  )
}
