// app/api/auth/sign-in/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ User খুঁজুন + credentials account + role + permissions আনুন
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { providerId: "credentials" },
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true, // permission.name access করার জন্য
              },
            },
          },
        },
      },
    });

    if (!user || user.accounts.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const account = user.accounts[0];
    const isPasswordValid = await bcrypt.compare(
      password,
      account.password ?? ""
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2️⃣ নতুন session তৈরি করুন
    const sessionToken = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress:
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          req.headers.get("x-real-ip") ||
          null,
        userAgent: req.headers.get("user-agent") ?? null,
      },
    });

    // 3️⃣ User permissions list বানান
    const permissions =
      user.role?.rolePermissions.map((rp) => rp.permission.name) || [];

    // 4️⃣ Response তৈরি করুন এবং cookie সেট করুন
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role?.name ?? null,
          permissions, // ✅ UI permission check করার জন্য
        },
      },
      { status: 200 }
    );

    // 🍪 session-token cookie সেট
    response.cookies.set("session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
