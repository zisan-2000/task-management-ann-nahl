import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientId, assignments } = body

    if (!clientId || !assignments || !Array.isArray(assignments)) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 })
    }

    // Start a transaction to ensure all assignments are processed together
    const result = await prisma.$transaction(async (tx) => {
      const updatePromises = assignments.map(({ taskId, agentId }: { taskId: string; agentId: string }) =>
        tx.task.update({
          where: { id: taskId },
          data: {
            assignedToId: agentId,
            status: "pending", // Reset status when reassigning
            updatedAt: new Date(),
          },
        }),
      )

      const updatedTasks = await Promise.all(updatePromises)

      // Create activity logs for each assignment
      const activityLogPromises = assignments.map(({ taskId, agentId }: { taskId: string; agentId: string }) =>
        tx.activityLog.create({
          data: {
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            entityType: "Task",
            entityId: taskId,
            userId: agentId,
            action: "task_assigned",
            details: {
              clientId,
              assignedAt: new Date().toISOString(),
              assignedBy: "system", // You can modify this to track who made the assignment
            },
          },
        }),
      )

      await Promise.all(activityLogPromises)

      // Update ClientTeamMember assigned tasks count
      const agentIds = [...new Set(assignments.map(({ agentId }: { agentId: string }) => agentId))]

      for (const agentId of agentIds) {
        const agentTaskCount = assignments.filter(({ agentId: id }: { agentId: string }) => id === agentId).length

        // Check if ClientTeamMember relationship exists
        const existingMember = await tx.clientTeamMember.findUnique({
          where: {
            clientId_agentId: {
              clientId,
              agentId,
            },
          },
        })

        if (existingMember) {
          // Update existing member
          await tx.clientTeamMember.update({
            where: {
              clientId_agentId: {
                clientId,
                agentId,
              },
            },
            data: {
              assignedTasks: {
                increment: agentTaskCount,
              },
            },
          })
        } else {
          // Create new team member relationship
          await tx.clientTeamMember.create({
            data: {
              clientId,
              agentId,
              assignedTasks: agentTaskCount,
              assignedDate: new Date(),
            },
          })
        }
      }

      return updatedTasks
    })

    // Create notifications for assigned agents
    const notificationPromises = assignments.map(({ taskId, agentId }: { taskId: string; agentId: string }) =>
      prisma.notification.create({
        data: {
          userId: agentId,
          taskId: taskId,
          type: "general",
          message: `You have been assigned a new task`,
          createdAt: new Date(),
        },
      }),
    )

    await Promise.all(notificationPromises)

    return NextResponse.json({
      message: "Tasks distributed successfully",
      assignedTasks: result.length,
      assignments: assignments,
    })
  } catch (error) {
    console.error("Error distributing tasks:", error)
    return NextResponse.json(
      { message: "Failed to distribute tasks", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
