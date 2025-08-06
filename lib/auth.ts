// lib/auth.ts

import prisma from "@/lib/prisma";

export async function getUserFromSession(token: string) {
  if (!token) return null;

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

  return session?.user || null;
}
