// app/api/auth/me/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 🍪 session-token cookie পড়ুন
    const token = req.cookies.get("session-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // DB থেকে session + user fetch করুন
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            role: {
              include: {
                rolePermissions: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = session.user;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.name ?? null,
        permissions:
          user.role?.rolePermissions.map((rp) => rp.permission.name) || [],
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
