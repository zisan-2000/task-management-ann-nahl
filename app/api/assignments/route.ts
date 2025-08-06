import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient, TaskStatus, TaskPriority } from "@prisma/client";

const prisma = new PrismaClient();

import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");

    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        client: true,
        template: {
          include: {
            sitesAssets: true,
            templateTeamMembers: {
              include: {
                agent: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        tasks: {
          include: {
            assignedTo: true,
          },
        },
        siteAssetSettings: true,
      },
      orderBy: {
        assignedAt: "desc",
      },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Failed to fetch assignments", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, templateId, status = "pending", agentIds = [] } = body;

    if (!clientId) {
      return NextResponse.json({ message: "Client ID is required" }, { status: 400 });
    }

    // 1. Create assignment
    const assignment = await prisma.assignment.create({
      data: {
        id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        clientId,
        templateId: templateId === "none" ? null : templateId,
        status,
        assignedAt: new Date(),
      },
    });

    // 2. If template is attached, generate tasks per site asset frequency
    if (templateId && templateId !== "none") {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
        include: { sitesAssets: true },
      });

      if (template && template.sitesAssets.length > 0) {
        const allTasks = [];

        for (const site of template.sitesAssets) {
          const frequency = site.defaultPostingFrequency ?? 1;
          const duration = site.defaultIdealDurationMinutes ?? 30;

          const startDate = new Date();
          startDate.setDate(startDate.getDate() + 7);

          for (let i = 0; i < frequency; i++) {
            const dueDate = new Date(startDate);
            dueDate.setDate(startDate.getDate() + i * 7); // space by 7 days

            allTasks.push({
              id: randomUUID(),
              name: `${site.name} Task ${i + 1}`,
              assignmentId: assignment.id,
              clientId: assignment.clientId,
              templateSiteAssetId: site.id,
              dueDate,
              status: TaskStatus.pending,
              priority: TaskPriority.medium,
              idealDurationMinutes: duration,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }

        await Promise.all(
          allTasks.map((task) =>
            prisma.task.create({
              data: task,
            })
          )
        );
      }
    }

    // 3. If agents are assigned to client, register them and assign tasks
    if (agentIds.length > 0) {
      await Promise.all(
        agentIds.map((agentId: string) =>
          prisma.clientTeamMember.create({
            data: {
              clientId,
              agentId,
              assignedDate: new Date(),
            },
          })
        )
      );

      const agents = await prisma.user.findMany({
        where: {
          id: { in: agentIds },
          roleId: "role-agent",
        },
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
        },
      });

      const agentTasks = agentIds.map((agentId: string) => {
        const agent = agents.find((a) => a.id === agentId);
        const taskName = agent
          ? `Task for ${agent.name || `${agent.firstName} ${agent.lastName}`}`
          : `Task for Agent ${agentId}`;

        return prisma.task.create({
          data: {
            id: randomUUID(),
            name: taskName,
            assignmentId: assignment.id,
            assignedToId: agentId,
            status: "pending",
            createdAt: new Date(),
          },
        });
      });

      await Promise.all(agentTasks);
    }

    // 4. Return full assignment info
    const completeAssignment = await prisma.assignment.findUnique({
      where: { id: assignment.id },
      include: {
        client: true,
        template: {
          include: {
            sitesAssets: true,
            templateTeamMembers: {
              include: {
                agent: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    firstName: true,
                    lastName: true,
                    category: true,
                  },
                },
              },
            },
          },
        },
        tasks: {
          include: {
            assignedTo: true,
          },
        },
        siteAssetSettings: true,
      },
    });

    return NextResponse.json(completeAssignment, { status: 201 });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      {
        message: "Failed to create assignment",
        error: (error as Error).message,
        details: (error as Error).stack,
      },
      { status: 500 }
    );
  }
}