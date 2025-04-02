import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Users
  const hashedPassword = await bcrypt.hash("user123", 10); // Hash password before saving

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "ADMIN",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "johndoe@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  // Create Policies
  const policy1 = await prisma.policy.create({
    data: {
      title: "Data Protection Policy",
      description: "Policy regarding user data protection.",
      status: "PUBLISHED",
    },
  });

  const policy2 = await prisma.policy.create({
    data: {
      title: "Security Policy",
      description: "Policy covering security best practices.",
      status: "DRAFT",
    },
  });

  // Assign Policies to Users
  await prisma.policyAssignment.createMany({
    data: [
      { userId: adminUser.id, policyId: policy1.id },
      { userId: regularUser.id, policyId: policy2.id },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
