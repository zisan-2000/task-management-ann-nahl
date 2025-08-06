"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, CheckCircle, ArrowLeft, User, Globe, Package, FileText, Image, Share2, Calendar } from 'lucide-react';
import { useRouter } from "next/navigation";
import { AssignmentPreview } from "./assignment-preview";

export function ReviewInfo({ formData, onPrevious }: any) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [packageName, setPackageName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch package name
        if (formData.packageId) {
          const packageRes = await fetch(`/api/packages/${formData.packageId}`);
          const packageData = await packageRes.json();
          if (packageData?.name) setPackageName(packageData.name);
        }

        // Fetch template name
        if (formData.templateId) {
          const templateRes = await fetch(`/api/packages/templates/${formData.templateId}`);
          const templateData = await templateRes.json();
          if (templateData?.name) setTemplateName(templateData.name);
        }
      } catch (error) {
        console.error("Failed to fetch details:", error);
      }
    };

    fetchDetails();
  }, [formData.packageId, formData.templateId]);

  const handleDownload = () => {
    const jsonData = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "client-onboarding-data.json";
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("JSON file downloaded successfully!");
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      const clientData = {
        name: formData.name,
        birthdate: formData.birthdate,
        company: formData.company,
        designation: formData.designation,
        location: formData.location,
        website: formData.website,
        website2: formData.website2,
        website3: formData.website3,
        biography: formData.biography,
        imageDrivelink: formData.imageDrivelink,
        companywebsite: formData.companywebsite,
        companyaddress: formData.companyaddress,
        avatar: formData.avatar,
        progress: formData.progress,
        status: formData.status,
        packageId: formData.packageId,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        socialLinks: formData.socialLinks || [],
      };

      // Create the client first
      const clientRes = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      const clientResult = await clientRes.json();

      if (!clientRes.ok) {
        toast.error(clientResult.error || "Failed to create client.");
        return;
      }

      const createdClientId = clientResult.id;
      toast.success("Client created successfully!");

      // If template is selected, create assignment automatically
      if (formData.templateId && createdClientId) {
        try {
          const assignment = {
            id: `assignment-${Date.now()}`,
            templateId: formData.templateId,
            clientId: createdClientId,
            assignedAt: new Date().toISOString(),
            status: "active",
          };

          const assignmentRes = await fetch("/api/assignments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(assignment),
          });

          if (assignmentRes.ok) {
            toast.success(`Template "${templateName}" assigned successfully!`);
          } else {
            console.error("Failed to create assignment");
            toast.warning("Client created but template assignment failed. You can assign it manually later.");
          }
        } catch (assignmentError) {
          console.error("Error creating assignment:", assignmentError);
          toast.warning("Client created but template assignment failed. You can assign it manually later.");
        }
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-8 py-12">
        <div className="flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-green-100 to-emerald-100 p-6">
            <CheckCircle className="h-20 w-20 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Submission Successful!
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Thank you for completing the onboarding process. Your client information has been saved successfully and is ready for processing.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={handleDownload} variant="outline" className="hover:bg-green-50 hover:text-green-700 hover:border-green-300">
            <Download className="w-4 h-4 mr-2" />
            Download JSON
          </Button>
          <Button
            onClick={() => router.push("/admin/clients")}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: "Personal Information",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      items: [
        { label: "Full Name", value: formData.name },
        { label: "Birth Date", value: formData.birthdate ? new Date(formData.birthdate).toLocaleDateString() : null },
        { label: "Location", value: formData.location },
        { label: "Company", value: formData.company },
        { label: "Designation", value: formData.designation },
        { label: "Status", value: formData.status },
      ].filter(item => item.value)
    },
    {
      title: "Website Information",
      icon: Globe,
      color: "from-purple-500 to-pink-500",
      items: [
        { label: "Primary Website", value: formData.website },
        { label: "Secondary Website", value: formData.website2 },
        { label: "Third Website", value: formData.website3 },
        { label: "Company Website", value: formData.companywebsite },
      ].filter(item => item.value)
    },
    {
      title: "Project Details",
      icon: Package,
      color: "from-green-500 to-emerald-500",
      items: [
        { label: "Package", value: packageName || formData.packageId },
        { label: "Template", value: templateName || formData.templateId },
        { label: "Start Date", value: formData.startDate ? new Date(formData.startDate).toLocaleDateString() : null },
        { label: "Due Date", value: formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : null },
        { label: "Progress", value: formData.progress !== undefined ? `${formData.progress}%` : null },
      ].filter(item => item.value)
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Review Your Information
        </h1>
        <p className="text-gray-500 text-lg">
          Please review all the information below before submitting your onboarding details.
        </p>
      </div>

      <div className="grid gap-6">
        {sections.map((section, index) => (
          section.items.length > 0 && (
            <Card key={index} className="overflow-hidden border-0 shadow-lg">
              <CardHeader className={`bg-gradient-to-r ${section.color} text-white`}>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <section.icon className="w-6 h-6" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500 mb-1">{item.label}</span>
                      <span className="text-gray-900 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        ))}

        {formData.biography && (
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardTitle className="flex items-center gap-3 text-xl">
                <FileText className="w-6 h-6" />
                Biography
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {formData.biography}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {formData.imageDrivelink && (
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Image className="w-6 h-6" />
                Image Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <a
                href={formData.imageDrivelink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline break-all font-medium"
              >
                {formData.imageDrivelink}
              </a>
            </CardContent>
          </Card>
        )}

        {formData.socialLinks && formData.socialLinks.length > 0 && (
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Share2 className="w-6 h-6" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.socialLinks.map(
                  (link: any, index: number) =>
                    link.platform &&
                    link.url && (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Badge variant="secondary" className="font-medium">
                          {link.platform}
                        </Badge>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline truncate flex-1"
                        >
                          {link.url}
                        </a>
                      </div>
                    )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {formData.templateId && (
          <AssignmentPreview 
            templateId={formData.templateId}
            packageId={formData.packageId || ""}
            templateName={templateName}
          />
        )}
      </div>

      <div className="flex justify-between pt-8">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 hover:border-purple-300"
        >
          Previous
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg px-8"
        >
          {isSaving ? "Saving..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
