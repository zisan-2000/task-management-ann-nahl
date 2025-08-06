//app/api/activity/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { timestamp: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },

      take: 20, // শুধু 20টা লগ দেখাও
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch activity logs",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
