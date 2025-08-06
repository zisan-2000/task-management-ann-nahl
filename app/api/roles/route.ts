//app/api/roles/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all roles
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: { select: { users: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

// POST: Create a new role
export async function POST(req: NextRequest) {
  try {
    const { id, name, description } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: "id and name are required" },
        { status: 400 }
      );
    }

    const newRole = await prisma.role.create({
      data: { id, name, description },
    });

    return NextResponse.json({ success: true, data: newRole });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create role" },
      { status: 500 }
    );
  }
}
