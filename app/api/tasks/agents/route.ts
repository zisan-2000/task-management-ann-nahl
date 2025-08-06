import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const agents = await prisma.user.findMany({
      where: {
        role: {
          name: {
            in: ["agent", "Agent", "AGENT"],
          },
        },
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    })

    return NextResponse.json(agents)
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ message: "Failed to fetch agents" }, { status: 500 })
  }
}
