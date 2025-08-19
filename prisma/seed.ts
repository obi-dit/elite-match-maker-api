import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Bachelor Pilot Show package
  const bachelorPackage = await prisma.package.upsert({
    where: { name: 'Bachelor Pilot Show' },
    update: {},
    create: {
      name: 'Bachelor Pilot Show',
      description:
        'Elite International Match Maker - Passport Bachelor Program in Santa Marta, Colombia',
      price: 6800.0,
      isActive: true,
    },
  });

  console.log('Created package:', bachelorPackage);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
