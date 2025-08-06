import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // cookies() কে এখন await করতে হবে
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!session || new Date() > session.expiresAt) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = session.user;

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name ?? null,
      roleId: user.roleId,
    },
  });
}
