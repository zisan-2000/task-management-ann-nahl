import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET Package by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    const pkg = await prisma.package.findUnique({
      where: { id },
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

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json(pkg);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

// ✅ PUT - Update Package
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    const body = await req.json();
    const { name, description } = body;

    const updated = await prisma.package.update({
      where: { id },
      data: {
        name,
        description: description || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update failed", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE - Delete Package
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    const existing = await prisma.package.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Package not found." },
        { status: 404 }
      );
    }

    const count = await prisma.package.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            clients: true,
            templates: true,
          },
        },
      },
    });

    if (count && (count._count.clients > 0 || count._count.templates > 0)) {
      return NextResponse.json(
        { error: "Cannot delete a package with related clients or templates." },
        { status: 409 }
      );
    }

    await prisma.package.delete({ where: { id } });

    return NextResponse.json({ message: "Package deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete package." },
      { status: 500 }
    );
  }
}
