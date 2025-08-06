"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Briefcase,
  CheckCircle,
  Sparkles,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  description: string | null;
}

export default function AddAgentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    teamId: "",
    role: "Member",
    address: "",
    bio: "",
    status: "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        console.log("Fetching teams...");
        const response = await fetch("/api/teams/list");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const teamsData = await response.json();
        console.log("Teams fetched:", teamsData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        toast.error("Failed to load teams", {
          description: "Please refresh the page to try again.",
        });
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.teamId) newErrors.teamId = "Team selection is required";
    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      console.log("Submitting agent data:", formData);

      // Step 1: Create the agent
      const agentResponse = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const agentResult = await agentResponse.json();
      console.log("Agent creation response:", agentResult);

      if (!agentResponse.ok) {
        throw new Error(agentResult.message || "Failed to create agent");
      }

      // Step 2: Assign agent to team
      try {
        const assignmentResponse = await fetch("/api/agents/assign-team", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agentId: agentResult.agent.id,
            teamId: formData.teamId,
            role: formData.role,
            assignmentType: "template",
          }),
        });

        const assignmentResult = await assignmentResponse.json();
        console.log("Team assignment response:", assignmentResult);

        if (!assignmentResponse.ok) {
          console.warn("Team assignment failed:", assignmentResult.message);
          // Don't fail the entire process if team assignment fails
          toast.warning("Agent created but team assignment failed", {
            description: "You can manually assign the agent to a team later.",
          });
        } else {
          console.log("Agent successfully assigned to team");
        }
      } catch (assignmentError) {
        console.warn("Team assignment error:", assignmentError);
        // Don't fail the entire process if team assignment fails
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowSuccess(true);
      toast.success("Agent created successfully!", {
        description: `${formData.firstName} ${formData.lastName} has been added to ${agentResult.agent.teamName}.`,
      });

      setTimeout(() => {
        router.push("/admin/agents");
      }, 2000);
    } catch (error) {
      console.error("Failed to create agent:", error);
      toast.error(`Error: ${(error as Error).message}`, {
        description: "Failed to create agent. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTeam = teams.find((team) => team.id === formData.teamId);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl border-0 shadow-2xl bg-white dark:bg-gray-900 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-1">
            <div className="bg-white dark:bg-gray-900 rounded-t-lg">
              <CardContent className="pt-12 pb-8">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-white animate-bounce" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Agent Created Successfully!
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-gray-50">
                        {formData.firstName} {formData.lastName}
                      </span>{" "}
                      has been added to{" "}
                      <span className="font-semibold text-gray-900 dark:text-gray-50">
                        {selectedTeam?.name}
                      </span>
                      .
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Link href="/admin/agents">
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3">
                        <Sparkles className="w-4 h-4 mr-2" />
                        View All Agents
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowSuccess(false);
                        setFormData({
                          firstName: "",
                          lastName: "",
                          email: "",
                          password: "",
                          phone: "",
                          teamId: "",
                          role: "Member",
                          address: "",
                          bio: "",
                          status: "active",
                        });
                        setErrors({});
                      }}
                      className="w-full sm:w-auto border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20 px-8 py-3"
                    >
                      Add Another Agent
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-4 px-4">
        <div className="w-full mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <Link href="/admin/agents">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Agents
              </Button>
            </Link>
            <div className="text-center sm:text-right">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add New Agent
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Card */}
            <Card className="border-0 shadow-xl overflow-hidden bg-white dark:bg-gray-900">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                        Personal Information
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                        Basic details about the agent
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2 text-purple-500" />
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className={`h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        errors.firstName
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2 text-purple-500" />
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className={`h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        errors.lastName
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2 text-purple-500" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={`h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        errors.email ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Lock className="w-4 h-4 mr-2 text-purple-500" />
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className={`h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.password || "Password is required"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-2 text-purple-500" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className={`h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        errors.phone ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                   <div className="space-y-3">
                  <Label
                    htmlFor="address"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Street address, City, State, ZIP"
                  />
                </div>
                </div>
               
                <div className="space-y-3">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2 text-purple-500" />
                    Biography
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Brief description about the agent..."
                    rows={4}
                    className="rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Team Assignment Card */}
            <Card className="border-0 shadow-xl overflow-hidden bg-white dark:bg-gray-900">
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                        Team Assignment
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                        Assign the agent to a team and set their role
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="teamId"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      Select Team *
                    </Label>
                    <Select
                      value={formData.teamId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, teamId: value }))
                      }
                      disabled={loadingTeams}
                    >
                      <SelectTrigger
                        className={`h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.teamId
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      >
                        <SelectValue
                          placeholder={
                            loadingTeams ? "Loading teams..." : "Select a team"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {teams.map((team) => (
                          <SelectItem
                            key={team.id}
                            value={team.id}
                            className="rounded-lg"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{team.name}</span>
                              {team.description && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {team.description}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.teamId && (
                      <p className="text-sm text-red-500 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.teamId}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="status"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="active" className="rounded-lg">
                          Active
                        </SelectItem>
                        <SelectItem value="inactive" className="rounded-lg">
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Team Preview */}
                {selectedTeam && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
                      Selected Team:
                    </h4>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-50">
                          {selectedTeam.name}
                        </p>
                        {selectedTeam.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedTeam.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
              <Link href="/admin/agents">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto text-gray-600 border-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-800 px-8 py-3 h-12 rounded-xl transition-all duration-200 bg-transparent"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.firstName.trim() ||
                  !formData.lastName.trim() ||
                  !formData.teamId
                }
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Agent...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Agent
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
