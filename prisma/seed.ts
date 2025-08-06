import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.permission.createMany({
    data: [
      {
        id: "template_edit",
        name: "template_edit",
        description: "Can edit templates",
      },
      {
        id: "template_delete",
        name: "template_delete",
        description: "Can delete templates",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
