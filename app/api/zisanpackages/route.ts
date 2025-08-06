import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            clients: true,
            templates: true,
          },
        },
      },
    });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPackage = await prisma.package.create({
      data: {
        name: body.name,
        description: body.description,
      },
    });
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}
