//api/tasks/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ========== CREATE TASK ==========
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const task = await prisma.task.create({
      data: {
        id: body.id,
        name: body.name,
        priority: body.priority ?? "medium",
        status: body.status ?? "pending",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        categoryId: body.categoryId,
        clientId: body.clientId,
        assignmentId: body.assignmentId,
        templateSiteAssetId: body.templateSiteAssetId,
        assignedToId: body.assignedToId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// ========== READ ALL TASKS ==========
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        client: true,
        category: true,
        assignedTo: true,
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}
