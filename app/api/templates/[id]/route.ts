import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient, SiteAssetType } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Same mapping utility from frontend to Prisma enum
const mapSiteAssetType = (frontendType: string): SiteAssetType => {
  switch (frontendType) {
    case "social_site":
      return SiteAssetType.social_site;
    case "web2_site":
      return SiteAssetType.web2_site;
    case "additional_site":
      return SiteAssetType.other_asset;
    default:
      return SiteAssetType.other_asset;
  }
};

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id;
    const body = await request.json();
    const {
      name,
      description,
      status = "draft",
      packageId,
      sitesAssets = [],
      teamMembers = [],
    } = body;

    if (!name?.trim() || !packageId?.trim()) {
      return NextResponse.json(
        { message: "Template name and package ID are required" },
        { status: 400 }
      );
    }

    // ✅ Validate and transform site assets
    const validSitesAssets = sitesAssets
      .filter((asset: any) => asset.name && asset.name.trim())
      .map((asset: any) => ({
        type: mapSiteAssetType(asset.type),
        name: asset.name.trim(),
        url: asset.url?.trim() || null,
        description: asset.description?.trim() || null,
        isRequired: Boolean(asset.isRequired),
        defaultPostingFrequency: Math.max(
          1,
          parseInt(asset.defaultPostingFrequency) || 1
        ),
        defaultIdealDurationMinutes: Math.max(
          1,
          parseInt(asset.defaultIdealDurationMinutes) || 30
        ),
      }));

    // ✅ Validate and transform team members
    const validTeamMembers = teamMembers
      .filter((member: any) => member.agentId && member.role)
      .map((member: any) => ({
        agentId: member.agentId,
        role: member.role.trim(),
        teamId:
          member.teamId && member.teamId !== "none" ? member.teamId : null,
        assignedDate: new Date(),
      }));

    // ✅ Update template
    const updatedTemplate = await prisma.template.update({
      where: { id: templateId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        status,
        packageId,
        sitesAssets: {
          deleteMany: {}, // Clear old ones
          create: validSitesAssets,
        },
        templateTeamMembers: {
          deleteMany: {}, // Clear old ones
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
    });

    return NextResponse.json(updatedTemplate, { status: 200 });
  } catch (error) {
    console.error("Error updating template:", error);

    if (error instanceof Error) {
      if (error.message.includes("Invalid value for argument `type`")) {
        return NextResponse.json(
          { message: "Invalid site asset type provided", error: error.message },
          { status: 400 }
        );
      }

      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          {
            message: "Invalid package ID or team member reference",
            error: error.message,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to update template",
        error:
          process.env.NODE_ENV === "development"
            ? (error as any)?.message
            : undefined,
      },
      { status: 500 }
    );
  }
}


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id;

    if (!templateId) {
      return NextResponse.json(
        { message: "Template ID is required" },
        { status: 400 }
      );
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        package: {
          select: {
            id: true,
            name: true,
          },
        },
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
    });

    if (!template) {
      return NextResponse.json(
        { message: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch template",
        error: process.env.NODE_ENV === "development" ? (error as any)?.message : undefined,
      },
      { status: 500 }
    );
  }
}


export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const templateId = params.id;

  try {
    // First, delete dependent records
    await prisma.templateSiteAsset.deleteMany({ where: { templateId } });
    await prisma.templateTeamMember.deleteMany({ where: { templateId } });
    await prisma.assignment.deleteMany({ where: { templateId } });

    // Then delete the template
    const deletedTemplate = await prisma.template.delete({
      where: { id: templateId },
    });

    return NextResponse.json({ message: "Template deleted successfully", deletedTemplate });
  } catch (error) {
    console.error("Error deleting template:", error);

    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json({ message: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Failed to delete template",
        error: process.env.NODE_ENV === "development" ? (error as any)?.message : undefined,
      },
      { status: 500 }
    );
  }
}