"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StepProps } from "@/types/onboarding"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export function GeneralInfo({ formData, updateFormData, onNext }: StepProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateFormData({ profilePicture: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">General Information</h1>
        <p className="text-gray-500 mt-2">Let's start with some basic information about you or your business.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter your full name"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label className="mb-2">Profile Picture</Label>
          <div className="mt-1 flex items-center space-x-4">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border border-gray-300">
              {previewUrl ? (
                <Image src={previewUrl || "/placeholder.svg"} alt="Profile preview" fill className="object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <label className="cursor-pointer">
              <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Upload size={16} />
                <span>Upload</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birthdate">Birth Date</Label>
            <div className="mt-1">
              <DatePicker
                selected={formData.birthdate ? new Date(formData.birthdate) : null}
                onChange={(date: Date | null) => updateFormData({ birthdate: date ? date.toISOString() : "" })}
                dateFormat="MMMM d, yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Select birth date"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => updateFormData({ location: e.target.value })}
              placeholder="Enter your location"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company || ""}
              onChange={(e) => updateFormData({ company: e.target.value })}
              placeholder="Enter your company"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              value={formData.designation || ""}
              onChange={(e) => updateFormData({ designation: e.target.value })}
              placeholder="Enter your designation"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="companyaddress">Company Address</Label>
          <Input
            id="companyaddress"
            value={formData.companyaddress || ""}
            onChange={(e) => updateFormData({ companyaddress: e.target.value })}
            placeholder="Enter company address"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="companywebsite">Company Website</Label>
          <Input
            id="companywebsite"
            value={formData.companywebsite || ""}
            onChange={(e) => updateFormData({ companywebsite: e.target.value })}
            placeholder="https://company.com"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status || ""} onValueChange={(value) => updateFormData({ status: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status" className="mb-1">Start Date</Label>
            <DatePicker
              selected={formData.startDate ? new Date(formData.startDate) : null}
              onChange={(date: Date | null) => updateFormData({ startDate: date ? date.toISOString() : "" })}
              dateFormat="MMMM d, yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Select start date"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div>
            <Label htmlFor="status" className="mb-1">Due Date</Label>
            <DatePicker
              selected={formData.dueDate ? new Date(formData.dueDate) : null}
              onChange={(date: Date | null) => updateFormData({ dueDate: date ? date.toISOString() : "" })}
              dateFormat="MMMM d, yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Select due date"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>


      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={onNext} disabled={!formData.name}>
          Next
        </Button>
      </div>
    </div>
  )
}
