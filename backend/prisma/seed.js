/* global process */
import 'dotenv/config';
import argon2 from 'argon2';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@allc.local';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Seed admin already exists.');
    return;
  }

  const passwordHash = await argon2.hash('Admin123!ChangeMe');
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: Role.SUPERADMIN,
    },
  });

  console.log('Seeded default superadmin: admin@allc.local / Admin123!ChangeMe');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
