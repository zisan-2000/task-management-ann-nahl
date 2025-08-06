// app/api/clients/[id]/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        package: true,
        teamMembers: {
          include: {
            agent: { include: { role: true } },
            team: true,
          },
        },
        tasks: {
          include: {
            assignedTo: { include: { role: true } },
            templateSiteAsset: true,
            category: true,
          },
        },
        assignments: {
          include: {
            template: {
              include: {
                sitesAssets: true,
                templateTeamMembers: {
                  include: {
                    agent: { include: { role: true } },
                    team: true,
                  },
                },
              },
            },
            siteAssetSettings: { include: { templateSiteAsset: true } },
            tasks: { include: { assignedTo: true, templateSiteAsset: true } },
          },
        },
        socialLinks: true,
      },
    })

    if (!client) return NextResponse.json({ message: "Client not found" }, { status: 404 })

    return NextResponse.json(client)
  } catch (error) {
    console.error(`Error fetching client ${id}:`, error)
    return NextResponse.json({ message: "Failed to fetch client" }, { status: 500 })
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  try {
    const body = await req.json()
    const {
      name,
      birthdate,
      company,
      designation,
      location,
      website,
      website2,
      website3,
      companywebsite,
      companyaddress,
      biography,
      imageDrivelink,
      avatar,
      progress,
      status,
      packageId,
      startDate,
      dueDate,
      socialLinks = [],
    } = body

    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        birthdate: birthdate ? new Date(birthdate) : undefined,
        company,
        designation,
        location,
        website,
        website2,
        website3,
        companywebsite,
        companyaddress,
        biography,
        imageDrivelink,
        avatar,
        progress,
        status,
        packageId,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,

        // replace social links
        socialLinks: {
          deleteMany: {}, // remove old
          create: socialLinks,
        },
      },
      include: {
        package: true,
        teamMembers: { include: { agent: { include: { role: true } }, team: true } },
        tasks: { include: { assignedTo: { include: { role: true } }, templateSiteAsset: true, category: true } },
        assignments: {
          include: {
            template: {
              include: {
                sitesAssets: true,
                templateTeamMembers: { include: { agent: { include: { role: true } }, team: true } },
              },
            },
            siteAssetSettings: { include: { templateSiteAsset: true } },
            tasks: { include: { assignedTo: true, templateSiteAsset: true } },
          },
        },
        socialLinks: true,
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error(`Error updating client ${id}:`, error)
    return NextResponse.json({ message: "Failed to update client" }, { status: 500 })
  }
}

