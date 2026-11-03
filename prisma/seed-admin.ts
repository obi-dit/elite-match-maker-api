import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const MIN_PASSWORD_LENGTH = 12;

export interface AdminSeedInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export async function seedAdmin(prisma: PrismaClient, input: AdminSeedInput) {
  const email = input.email?.trim();
  const password = input.password ?? '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('SEED_ADMIN_EMAIL must be a valid email address.');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `SEED_ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    );
  }

  const hash = await argon2.hash(password);
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: 'ADMIN' },
    create: {
      email,
      password: hash,
      role: 'ADMIN',
      firstName: input.firstName?.trim() || 'Elite',
      lastName: input.lastName?.trim() || 'Admin',
    },
    select: { id: true, email: true },
  });

  console.log(
    existing
      ? `Existing user ${admin.email} (id ${admin.id}) is now ADMIN and its password was reset.`
      : `Created admin ${admin.email} (id ${admin.id}).`,
  );
  return admin;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedAdmin(prisma, {
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
      firstName: process.env.SEED_ADMIN_FIRST_NAME,
      lastName: process.env.SEED_ADMIN_LAST_NAME,
    });
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Admin seed failed: ${(error as Error).message}`);
    process.exit(1);
  });
}
