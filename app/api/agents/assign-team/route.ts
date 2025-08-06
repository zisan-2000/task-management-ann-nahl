import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { agentId, teamId, role = "Member", assignmentType = "template" } = await request.json()
    console.log("Assigning agent to team:", { agentId, teamId, role, assignmentType })

    if (!agentId || !teamId) {
      return NextResponse.json({ message: "Agent ID and Team ID are required" }, { status: 400 })
    }

    // Verify agent exists
    const agent = await prisma.user.findUnique({
      where: { id: agentId },
    })

    if (!agent) {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 })
    }

    // Verify team exists
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 })
    }

    let teamMember

    if (assignmentType === "client") {
      // For client team assignments, you'd need a clientId
      // This is a placeholder - adjust based on your business logic
      return NextResponse.json({ message: "Client team assignment requires clientId" }, { status: 400 })
    } else {
      // For template team assignments
      // First, check if we have any templates, if not create a default one
      let template = await prisma.template.findFirst()

      if (!template) {
        // Create a default template
        template = await prisma.template.create({
          data: {
            id: "default-template",
            name: "Default Template",
            description: "Default template for team assignments",
          },
        })
        console.log("Created default template:", template.id)
      }

      // Check if assignment already exists
      const existingAssignment = await prisma.templateTeamMember.findFirst({
        where: {
          agentId: agentId,
          teamId: teamId,
          templateId: template.id,
        },
      })

      if (existingAssignment) {
        return NextResponse.json({ message: "Agent is already assigned to this team" }, { status: 400 })
      }

      // Create the team assignment
      teamMember = await prisma.templateTeamMember.create({
        data: {
          templateId: template.id,
          agentId: agentId,
          teamId: teamId,
          role: role,
          assignedDate: new Date(),
        },
        include: {
          agent: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          team: {
            select: {
              name: true,
            },
          },
        },
      })
    }

    console.log("Team assignment created successfully")

    return NextResponse.json(
      {
        message: "Agent assigned to team successfully",
        assignment: teamMember,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in POST /api/agents/assign-team:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { agentId, teamId, assignmentType = "template" } = await request.json()

    if (!agentId || !teamId) {
      return NextResponse.json({ message: "Agent ID and Team ID are required" }, { status: 400 })
    }

    if (assignmentType === "client") {
      await prisma.clientTeamMember.deleteMany({
        where: {
          agentId: agentId,
          teamId: teamId,
        },
      })
    } else {
      await prisma.templateTeamMember.deleteMany({
        where: {
          agentId: agentId,
          teamId: teamId,
        },
      })
    }

    return NextResponse.json({ message: "Team assignment removed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error in DELETE /api/agents/assign-team:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
