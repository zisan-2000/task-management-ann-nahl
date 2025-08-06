"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Share2,
  Globe,
  FileText,
  X,
  RotateCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface SiteAsset {
  type: "social_site" | "web2_site" | "additional_site";
  name: string;
  url: string;
  description: string;
  isRequired: boolean;
  defaultPostingFrequency: number;
  defaultIdealDurationMinutes: number;
}

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  onCreated: () => void;
  initialData?: Template | null;
  isEditMode?: boolean;
}

const DEFAULT_SOCIAL_SITES = [
  { name: "Facebook", url: "https://facebook.com", isRequired: true },
  { name: "Twitter", url: "https://twitter.com", isRequired: true },
  { name: "Instagram", url: "https://instagram.com", isRequired: true },
  { name: "LinkedIn", url: "https://linkedin.com", isRequired: true },
  { name: "Pinterest", url: "https://pinterest.com", isRequired: false },
  { name: "YouTube", url: "https://youtube.com", isRequired: false },
  { name: "TikTok", url: "https://tiktok.com", isRequired: false },
  { name: "Reddit", url: "https://reddit.com", isRequired: false },
];

const DEFAULT_WEB2_SITES = [
  { name: "Blogger", url: "https://blogger.com", isRequired: true },
  { name: "WordPress", url: "https://wordpress.com", isRequired: true },
  { name: "Medium", url: "https://medium.com", isRequired: false },
  { name: "Ghost", url: "https://ghost.org", isRequired: false },
  { name: "Substack", url: "https://substack.com", isRequired: false },
  { name: "HubPages", url: "https://hubpages.com", isRequired: false },
];

const DEFAULT_ADDITIONAL_SITES = [
  {
    name: "Google My Business",
    url: "https://google.com/business",
    isRequired: true,
  },
  { name: "Yelp", url: "https://yelp.com", isRequired: false },
  { name: "TripAdvisor", url: "https://tripadvisor.com", isRequired: false },
  { name: "Crunchbase", url: "https://crunchbase.com", isRequired: false },
  { name: "Product Hunt", url: "https://producthunt.com", isRequired: false },
  { name: "Quora", url: "https://quora.com", isRequired: false },
];

export function CreateTemplateModal({
  isOpen,
  onClose,
  packageId,
  onCreated,
  initialData,
  isEditMode = false,
}: CreateTemplateModalProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Basic template fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");

  // Site assets
  const [socialSites, setSocialSites] = useState<SiteAsset[]>([]);
  const [web2Sites, setWeb2Sites] = useState<SiteAsset[]>([]);
  const [additionalSites, setAdditionalSites] = useState<SiteAsset[]>([]);

  const steps = [
    {
      id: 0,
      title: "Basic Info",
      description: "Template details",
      icon: FileText,
    },
    {
      id: 1,
      title: "Social Sites",
      description: "Social media platforms",
      icon: Share2,
    },
    {
      id: 2,
      title: "Web 2.0 Sites",
      description: "Blogging platforms",
      icon: Globe,
    },
    {
      id: 3,
      title: "Additional Sites",
      description: "Other platforms",
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        // Load existing data for edit mode
        setName(initialData.name);
        setDescription(initialData.description || "");
        setStatus(initialData.status || "draft");
        
        // Load existing site assets
        const social = initialData.sitesAssets?.filter(s => s.type === "social_site") || [];
        const web2 = initialData.sitesAssets?.filter(s => s.type === "web2_site") || [];
        const additional = initialData.sitesAssets?.filter(s => s.type === "additional_site") || [];
        
        setSocialSites(social.length > 0 ? social : 
          DEFAULT_SOCIAL_SITES.map(site => ({
            type: "social_site",
            name: site.name,
            url: site.url,
            description: "",
            isRequired: site.isRequired,
            defaultPostingFrequency: 3,
            defaultIdealDurationMinutes: 30,
          }))
        );
        
        setWeb2Sites(web2.length > 0 ? web2 : 
          DEFAULT_WEB2_SITES.map(site => ({
            type: "web2_site",
            name: site.name,
            url: site.url,
            description: "",
            isRequired: site.isRequired,
            defaultPostingFrequency: 3,
            defaultIdealDurationMinutes: 30,
          }))
        );
        
        setAdditionalSites(additional.length > 0 ? additional : 
          DEFAULT_ADDITIONAL_SITES.map(site => ({
            type: "additional_site",
            name: site.name,
            url: site.url,
            description: "",
            isRequired: site.isRequired,
            defaultPostingFrequency: 3,
            defaultIdealDurationMinutes: 30,
          }))
        );
      } else {
        // Initialize defaults for create mode
        initializeDefaultAssets();
      }
      setCurrentStep(0);
    }
  }, [isOpen, isEditMode, initialData]);

  const initializeDefaultAssets = () => {
    setName("");
    setDescription("");
    setStatus("draft");
    
    setSocialSites(
      DEFAULT_SOCIAL_SITES.map((site) => ({
        type: "social_site",
        name: site.name,
        url: site.url,
        description: "",
        isRequired: site.isRequired,
        defaultPostingFrequency: 3,
        defaultIdealDurationMinutes: 30,
      }))
    );

    setWeb2Sites(
      DEFAULT_WEB2_SITES.map((site) => ({
        type: "web2_site",
        name: site.name,
        url: site.url,
        description: "",
        isRequired: site.isRequired,
        defaultPostingFrequency: 3,
        defaultIdealDurationMinutes: 30,
      }))
    );

    setAdditionalSites(
      DEFAULT_ADDITIONAL_SITES.map((site) => ({
        type: "additional_site",
        name: site.name,
        url: site.url,
        description: "",
        isRequired: site.isRequired,
        defaultPostingFrequency: 3,
        defaultIdealDurationMinutes: 30,
      }))
    );
  };

  const resetForm = () => {
    initializeDefaultAssets();
    setCurrentStep(0);
  };

  const addSiteAsset = (
    type: "social_site" | "web2_site" | "additional_site"
  ) => {
    const newAsset: SiteAsset = {
      type,
      name: "",
      url: "",
      description: "",
      isRequired: false,
      defaultPostingFrequency: 3,
      defaultIdealDurationMinutes: 30,
    };

    if (type === "social_site") {
      setSocialSites([...socialSites, newAsset]);
    } else if (type === "web2_site") {
      setWeb2Sites([...web2Sites, newAsset]);
    } else {
      setAdditionalSites([...additionalSites, newAsset]);
    }
  };

  const removeSiteAsset = (
    type: "social_site" | "web2_site" | "additional_site",
    index: number
  ) => {
    if (type === "social_site") {
      setSocialSites(socialSites.filter((_, i) => i !== index));
    } else if (type === "web2_site") {
      setWeb2Sites(web2Sites.filter((_, i) => i !== index));
    } else {
      setAdditionalSites(additionalSites.filter((_, i) => i !== index));
    }
  };

  const updateSiteAsset = (
    type: "social_site" | "web2_site" | "additional_site",
    index: number,
    field: keyof SiteAsset,
    value: any
  ) => {
    if (type === "social_site") {
      const updated = [...socialSites];
      updated[index] = { ...updated[index], [field]: value };
      setSocialSites(updated);
    } else if (type === "web2_site") {
      const updated = [...web2Sites];
      updated[index] = { ...updated[index], [field]: value };
      setWeb2Sites(updated);
    } else {
      const updated = [...additionalSites];
      updated[index] = { ...updated[index], [field]: value };
      setAdditionalSites(updated);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return name.trim().length > 0;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Template name is required");
      return;
    }

    setLoading(true);
    try {
      // Combine all site assets
      const allSiteAssets = [
        ...socialSites.filter((site) => site.name.trim()),
        ...web2Sites.filter((site) => site.name.trim()),
        ...additionalSites.filter((site) => site.name.trim()),
      ];

      const templateData = {
        name: name.trim(),
        description: description.trim() || null,
        status,
        packageId,
        sitesAssets: allSiteAssets,
      };

      const url = isEditMode && initialData 
        ? `/api/templates/${initialData.id}`
        : "/api/templates";
        
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      if (res.ok) {
        toast.success(
          isEditMode 
            ? "Template updated successfully" 
            : "Template created successfully"
        );
        onCreated();
        onClose();
        resetForm();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save template");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving the template");
    } finally {
      setLoading(false);
    }
  };

  const renderSiteAssetFields = (
    sites: SiteAsset[],
    type: "social_site" | "web2_site" | "additional_site",
    title: string,
    icon: React.ReactNode,
    gradientClass: string,
    borderClass: string,
    accentClass: string
  ) => (
    <div className="space-y-6">
      <div className={`${gradientClass} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              {icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-white/80">
                Configure your {title.toLowerCase()}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
          >
            {sites.filter((site) => site.name.trim()).length} Sites
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {sites.map((site, index) => (
          <Card
            key={index}
            className={`${borderClass} border-2 shadow-md hover:shadow-lg transition-all duration-200 group`}
          >
            <CardContent className="p-6 space-y-4 relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                onClick={() => removeSiteAsset(type, index)}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`${type}-name-${index}`}
                    className="text-sm font-semibold text-gray-700"
                  >
                    Site Name *
                  </Label>
                  <Input
                    id={`${type}-name-${index}`}
                    value={site.name}
                    onChange={(e) =>
                      updateSiteAsset(type, index, "name", e.target.value)
                    }
                    placeholder="e.g., Facebook, Medium, etc."
                    className="bg-white border-2 focus:border-blue-400 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`${type}-url-${index}`}
                    className="text-sm font-semibold text-gray-700"
                  >
                    URL
                  </Label>
                  <Input
                    id={`${type}-url-${index}`}
                    value={site.url}
                    onChange={(e) =>
                      updateSiteAsset(type, index, "url", e.target.value)
                    }
                    placeholder="https://..."
                    className="bg-white border-2 focus:border-blue-400 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`${type}-description-${index}`}
                  className="text-sm font-semibold text-gray-700"
                >
                  Description
                </Label>
                <Textarea
                  id={`${type}-description-${index}`}
                  value={site.description}
                  onChange={(e) =>
                    updateSiteAsset(type, index, "description", e.target.value)
                  }
                  placeholder="Brief description of this site/asset..."
                  rows={2}
                  className="bg-white border-2 focus:border-blue-400 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Switch
                    id={`${type}-required-${index}`}
                    checked={site.isRequired}
                    onCheckedChange={(checked) =>
                      updateSiteAsset(type, index, "isRequired", checked)
                    }
                    className={`${site.isRequired ? accentClass : ""}`}
                  />
                  <Label
                    htmlFor={`${type}-required-${index}`}
                    className="text-sm font-semibold text-gray-700"
                  >
                    Required
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`${type}-frequency-${index}`}
                    className="text-sm font-semibold text-gray-700"
                  >
                    Posts per Month
                  </Label>
                  <Input
                    id={`${type}-frequency-${index}`}
                    type="number"
                    min="1"
                    value={site.defaultPostingFrequency}
                    onChange={(e) =>
                      updateSiteAsset(
                        type,
                        index,
                        "defaultPostingFrequency",
                        Number.parseInt(e.target.value) || 1
                      )
                    }
                    className="bg-white border-2 focus:border-blue-400 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`${type}-duration-${index}`}
                    className="text-sm font-semibold text-gray-700"
                  >
                    Duration (minutes)
                  </Label>
                  <Input
                    id={`${type}-duration-${index}`}
                    type="number"
                    min="1"
                    value={site.defaultIdealDurationMinutes}
                    onChange={(e) =>
                      updateSiteAsset(
                        type,
                        index,
                        "defaultIdealDurationMinutes",
                        Number.parseInt(e.target.value) || 30
                      )
                    }
                    className="bg-white border-2 focus:border-blue-400 rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => addSiteAsset(type)}
          className={`flex-1 border-dashed border-2 ${borderClass} hover:bg-gradient-to-r hover:${gradientClass} hover:text-white transition-all duration-200 rounded-lg py-3`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {title.slice(0, -1)}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={initializeDefaultAssets}
          className="flex-1 border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg py-3"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          Reset Defaults
        </Button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 text-white">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Basic Information</h2>
                  <p className="text-white/80">Set up your template details</p>
                </div>
              </div>
            </div>

            <Card className="border-2 border-blue-200 shadow-md">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Template Name *
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter template name"
                      className="bg-white border-2 focus:border-blue-400 rounded-lg py-3"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="status"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Status
                    </Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="bg-white border-2 focus:border-blue-400 rounded-lg py-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            Draft
                          </div>
                        </SelectItem>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-gray-500" />
                            Inactive
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this template..."
                    rows={4}
                    className="bg-white border-2 focus:border-blue-400 rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 1:
        return renderSiteAssetFields(
          socialSites,
          "social_site",
          "Social Sites",
          <Share2 className="w-6 h-6" />,
          "from-blue-500 to-cyan-500",
          "border-blue-300",
          "data-[state=checked]:bg-blue-600"
        );

      case 2:
        return renderSiteAssetFields(
          web2Sites,
          "web2_site",
          "Web 2.0 Sites",
          <Globe className="w-6 h-6" />,
          "from-purple-500 to-pink-500",
          "border-purple-300",
          "data-[state=checked]:bg-purple-600"
        );

      case 3:
        return renderSiteAssetFields(
          additionalSites,
          "additional_site",
          "Additional Sites",
          <Sparkles className="w-6 h-6" />,
          "from-green-500 to-teal-500",
          "border-green-300",
          "data-[state=checked]:bg-green-600"
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <FileText className="w-8 h-8 text-blue-600" />
            {isEditMode ? "Edit Template" : "Create New Template"}
          </DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110"
                          : isCompleted
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={`text-sm font-semibold ${
                          isActive ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full ${
                        isCompleted ? "bg-green-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <Progress
            value={((currentStep + 1) / steps.length) * 100}
            className="h-2 bg-gray-200"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-1 pb-4">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 bg-white rounded-b-lg px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50 rounded-lg px-6 py-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-2 border-gray-300 hover:bg-gray-50 rounded-lg px-6 py-2"
            >
              Cancel
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg disabled:opacity-50 rounded-lg px-6 py-2 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg disabled:opacity-50 rounded-lg px-8 py-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditMode ? "Update Template" : "Create Template"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}