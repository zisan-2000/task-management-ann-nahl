import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient, SiteAssetType } from "@prisma/client"

const prisma = new PrismaClient()

// ✅ Map frontend type strings to valid Prisma SiteAssetType enum values
const mapSiteAssetType = (frontendType: string): SiteAssetType => {
  switch (frontendType) {
    case "social_site":
      return SiteAssetType.social_site
    case "web2_site":
      return SiteAssetType.web2_site
    case "additional_site":
      return SiteAssetType.other_asset
    default:
      return SiteAssetType.other_asset
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      status = "draft",
      packageId,
      sitesAssets = [],
      teamMembers = [],
    } = body

    // ✅ Basic validation
    if (!name?.trim() || !packageId?.trim()) {
      return NextResponse.json({ message: "Template name and package ID are required" }, { status: 400 })
    }

    // ✅ Transform and validate site assets
    const validSitesAssets = sitesAssets
      .filter((asset: any) => asset.name && asset.name.trim())
      .map((asset: any) => ({
        type: mapSiteAssetType(asset.type),
        name: asset.name.trim(),
        url: asset.url?.trim() || null,
        description: asset.description?.trim() || null,
        isRequired: Boolean(asset.isRequired),
        defaultPostingFrequency: Math.max(1, parseInt(asset.defaultPostingFrequency) || 1),
        defaultIdealDurationMinutes: Math.max(1, parseInt(asset.defaultIdealDurationMinutes) || 30),
      }))

    // ✅ Transform and validate team members
    const validTeamMembers = teamMembers
      .filter((member: any) => member.agentId && member.role)
      .map((member: any) => ({
        agentId: member.agentId,
        role: member.role.trim(),
        teamId: member.teamId && member.teamId !== "none" ? member.teamId : null,
        assignedDate: new Date(),
      }))

    // ✅ Create the template
    const newTemplate = await prisma.template.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        status,
        packageId,
        sitesAssets: {
          create: validSitesAssets,
        },
        templateTeamMembers: {
          create: validTeamMembers,
        },
      },
      include: {
        package: true,
        sitesAssets: true,
        templateTeamMembers: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            sitesAssets: true,
            templateTeamMembers: true,
            assignments: true,
          },
        },
      },
    })

    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error) {
    console.error("Error creating template:", error)

    // ✅ Specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Invalid value for argument `type`")) {
        return NextResponse.json(
          { message: "Invalid site asset type provided", error: error.message },
          { status: 400 }
        )
      }

      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { message: "Invalid package ID or team member reference", error: error.message },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      {
        message: "Failed to create template",
        error: process.env.NODE_ENV === "development" ? (error as any)?.message : undefined,
      },
      { status: 500 }
    )
  }
}


