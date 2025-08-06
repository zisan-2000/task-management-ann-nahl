


const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Define our roles
  const roles = [
    { id: 'role-admin', name: 'admin', description: 'Administrator role' },
    { id: 'role-agent', name: 'agent', description: 'Agent role' },
    { id: 'role-manager', name: 'manager', description: 'Manager role' },
  ];

  // First delete all existing roles (if you want to start fresh)
  // await prisma.role.deleteMany({});

  // Create roles only if they don't exist
  for (const role of roles) {
    try {
      await prisma.role.create({
        data: role
      });
      console.log(`Created role: ${role.name}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`Role ${role.name} already exists, skipping creation`);
      } else {
        throw error;
      }
    }
  }

  console.log("✅ Roles seeded successfully");

  // Create default users with accounts
  const users = [
    {
      id: 'user-admin',
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      roleName: "admin",
    },
    {
      id: 'user-agent',
      name: "Agent User",
      email: "agent@example.com",
      password: "agent123",
      roleName: "agent",
    },
    {
      id: 'user-manager',
      name: "Manager User",
      email: "manager@example.com",
      password: "manager123",
      roleName: "manager",
    },
  ];

  for (const user of users) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      await prisma.$transaction(async (prisma) => {
        // Find the role
        const role = await prisma.role.findUnique({
          where: { name: user.roleName }
        });

        if (!role) {
          throw new Error(`Role ${user.roleName} not found`);
        }

        // Create or update user
        const createdUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            passwordHash: hashedPassword,
            roleId: role.id,
            status: 'active',
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ')[1],
            emailVerified: true,
          },
          create: {
            id: user.id,
            name: user.name,
            email: user.email,
            passwordHash: hashedPassword,
            emailVerified: true,
            roleId: role.id,
            status: 'active',
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ')[1],
          },
        });

        // Create or update account
        const existingAccount = await prisma.account.findFirst({
          where: {
            userId: createdUser.id,
            providerId: 'credentials'
          }
        });

        if (existingAccount) {
          await prisma.account.update({
            where: { id: existingAccount.id },
            data: {
              accessToken: `token-${user.roleName}`,
              refreshToken: `refresh-${user.roleName}`,
              password: hashedPassword,
              updatedAt: new Date(),
            }
          });
        } else {
          await prisma.account.create({
            data: {
              id: `account-${user.roleName}`,
              accountId: `account-${user.roleName}`,
              providerId: 'credentials',
              userId: createdUser.id,
              accessToken: `token-${user.roleName}`,
              refreshToken: `refresh-${user.roleName}`,
              password: hashedPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          });
        }

        console.log(`Created/updated user ${user.email} with role ${user.roleName}`);
      });
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error.message);
    }
  }

  console.log("✅ Seeding completed");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });