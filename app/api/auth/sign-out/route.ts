// app/api/auth/sign-out/route.ts

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // 🍪 session-token cookie থেকে পড়া
    const sessionToken = cookies().get("session-token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "No active session found" },
        { status: 400 }
      );
    }

    // 🗑️ DB থেকে session ডিলিট
    await prisma.session.deleteMany({
      where: { token: sessionToken },
    });

    // ❌ Cookie clear করা
    const response = NextResponse.json(
      { success: true, message: "Signed out successfully" },
      { status: 200 }
    );

    response.cookies.set("session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // expire immediately
    });

    return response;
  } catch (error) {
    console.error("❌ Sign-out error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong during sign-out" },
      { status: 500 }
    );
  }
}
