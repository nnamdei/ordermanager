import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords for security
  const userPassword = await bcrypt.hash('user1234', 10);
  const adminPassword = await bcrypt.hash('admin1234', 10);

  // Seed a regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      username: 'regularUser',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: userPassword,
      role: 'user',
    },
  });

  // Seed an admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'adminUser',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      password: adminPassword,
      role: 'admin',
    },
  });

  console.log('Seed data created:');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
