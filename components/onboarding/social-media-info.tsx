"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"
import type { StepProps } from "@/types/onboarding"

interface SocialLink {
  platform: string
  url: string
}

export function SocialMediaInfo({ formData, updateFormData, onNext, onPrevious }: StepProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(formData.socialLinks || [{ platform: "", url: "" }])

  const socialPlatforms = [
    "Facebook",
    "Twitter",
    "Instagram",
    "LinkedIn",
    "YouTube",
    "TikTok",
    "Pinterest",
    "Reddit",
    "Snapchat",
    "Discord",
    "Other",
  ]

  const addSocialLink = () => {
    const newLinks = [...socialLinks, { platform: "", url: "" }]
    setSocialLinks(newLinks)
    updateFormData({ socialLinks: newLinks })
  }

  const removeSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index)
    setSocialLinks(newLinks)
    updateFormData({ socialLinks: newLinks })
  }

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setSocialLinks(newLinks)
    updateFormData({ socialLinks: newLinks })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Social Media Profiles</h1>
        <p className="text-gray-500 mt-2">Add your social media profiles to enhance your online presence.</p>
      </div>

      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor={`platform-${index}`}>Platform</Label>
              <Select value={link.platform} onValueChange={(value) => updateSocialLink(index, "platform", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-2">
              <Label htmlFor={`url-${index}`}>URL</Label>
              <Input
                id={`url-${index}`}
                value={link.url}
                onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                placeholder="https://platform.com/username"
                className="mt-1"
              />
            </div>

            {socialLinks.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeSocialLink(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addSocialLink} className="w-full bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Social Link
        </Button>
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
