import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { agentId: string } }) {
  try {
    const { agentId } = params

    // if (!agentId) {
    //   return NextResponse.json({ error: "Agent ID is required" }, { status: 400 })
    // }

    // Fetch tasks assigned to the specific agent
    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: agentId,
      },
      include: {
        assignment: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            template: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        templateSiteAsset: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        },
      },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { dueDate: "asc" }],
    })

    // Get task statistics
    const stats = {
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "pending").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
      overdue: tasks.filter((task) => task.status === "overdue").length,
      cancelled: tasks.filter((task) => task.status === "cancelled").length,
    }

    return NextResponse.json({
      tasks,
      stats,
    })
  } catch (error) {
    console.error("Error fetching agent tasks:", error)
    return NextResponse.json({ error: "Failed to fetch agent tasks", message: error.message }, { status: 500 })
  }
}

// Update task status
export async function PATCH(request: NextRequest, { params }: { params: { agentId: string } }) {
  try {
    const { agentId } = params
    const body = await request.json()
    const { taskId, status, performanceRating, completionLink, actualDurationMinutes } = body

    if (!taskId || !status) {
      return NextResponse.json({ error: "Task ID and status are required" }, { status: 400 })
    }

    // Verify the task belongs to the agent
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        assignedToId: agentId,
      },
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found or not assigned to this agent" }, { status: 404 })
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status,
        ...(status === "completed" && { completedAt: new Date() }),
        ...(performanceRating && { performanceRating }),
        ...(completionLink && { completionLink }),
        ...(actualDurationMinutes && { actualDurationMinutes }),
      },
      include: {
        assignment: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        templateSiteAsset: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task", message: error.message }, { status: 500 })
  }
}
