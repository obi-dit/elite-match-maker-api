import { PrismaClient } from '@prisma/client';
import { seedFeatures } from './seed-features';
import { seedAdmin } from './seed-admin';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await seedAdmin(prisma, {
    email: 'admin@mailinator.com',
    password: 'default-password',
  });

  // Seed features and tier relationships
  await seedFeatures();

  await prisma.package.upsert({
    where: { name: 'Application Fee' },
    update: {
      price: 50.0,
      isActive: true,
      description:
        'Non-refundable application processing fee for Elite International Match Maker.',
    },
    create: {
      name: 'Application Fee',
      description:
        'Non-refundable application processing fee for Elite International Match Maker.',
      price: 50.0,
      isActive: true,
    },
  });

  // Create Starter Package
  const starterPackage = await prisma.package.upsert({
    where: { name: 'Starter Package' },
    update: {},
    create: {
      name: 'Starter Package',
      description:
        'Perfect introduction to elite matchmaking services with AI-powered compatibility matching and lie detection.',
      price: 2000.0,
      isActive: true,
    },
  });

  // Create Premium Package
  const premiumPackage = await prisma.package.upsert({
    where: { name: 'Premium Package' },
    update: {},
    create: {
      name: 'Premium Package',
      description:
        'Enhanced matchmaking with dedicated matchmaker, custom recruitment, and virtual coffee dates.',
      price: 4000.0,
      isActive: true,
    },
  });

  // Create Elite Gold Package
  const eliteGoldPackage = await prisma.package.upsert({
    where: { name: 'Elite Gold Package' },
    update: {},
    create: {
      name: 'Elite Gold Package',
      description:
        'Premium experience with enhanced photoshoot, nationwide recruitment, and in-person introductions in Colombia.',
      price: 8000.0,
      isActive: true,
    },
  });

  // Create Passport Bachelor Experience
  const passportBachelorPackage = await prisma.package.upsert({
    where: { name: 'Passport Bachelor Experience' },
    update: {},
    create: {
      name: 'Passport Bachelor Experience',
      description:
        'Ultimate event-based experience with villa stay, 14 vetted contestants, and comprehensive dating support.',
      price: 15000.0,
      isActive: true,
    },
  });

  // Create Add-On Services
  // const backgroundVerification = await prisma.package.upsert({
  //   where: { name: 'Background Verification' },
  //   update: {},
  //   create: {
  //     name: 'Background Verification',
  //     description:
  //       'Comprehensive background check and verification for any candidate.',
  //     price: 250.0,
  //     isActive: true,
  //   },
  // });

  // const eliteTvPodcast = await prisma.package.upsert({
  //   where: { name: 'Elite TV Podcast Appearance' },
  //   update: {},
  //   create: {
  //     name: 'Elite TV Podcast Appearance',
  //     description:
  //       'Featured introduction reel on Elite Matchmaker Podcast with professional production.',
  //     price: 750.0,
  //     isActive: true,
  //   },
  // });

  // const conciergeServices = await prisma.package.upsert({
  //   where: { name: 'Personalized Concierge Services' },
  //   update: {},
  //   create: {
  //     name: 'Personalized Concierge Services',
  //     description:
  //       'Custom concierge services in Colombia including travel arrangements, local guidance, and personalized support.',
  //     price: 0.0, // Pricing upon request
  //     isActive: true,
  //   },
  // });

  // Create Add-On Services
  const backgroundVerification = await prisma.addOn.upsert({
    where: { name: 'Background Verification' },
    update: {},
    create: {
      name: 'Background Verification',
      description:
        'Comprehensive background check and verification for any candidate including criminal record check, employment verification, education verification, and reference checks.',
      price: 250.0,
      isCustomPricing: false,
      category: 'VERIFICATION',
      isActive: true,
    },
  });

  const eliteTvPodcast = await prisma.addOn.upsert({
    where: { name: 'Elite TV Podcast Appearance' },
    update: {},
    create: {
      name: 'Elite TV Podcast Appearance',
      description:
        'Featured introduction reel on Elite Matchmaker Podcast with professional production, editing, and social media promotion.',
      price: 750.0,
      isCustomPricing: false,
      category: 'MEDIA',
      isActive: true,
    },
  });

  const conciergeServices = await prisma.addOn.upsert({
    where: { name: 'Personalized Concierge Services' },
    update: {},
    create: {
      name: 'Personalized Concierge Services',
      description:
        'Custom concierge services in Colombia including travel arrangements, local guidance, personalized support, accommodation booking, and transportation services.',
      price: null, // Custom pricing
      isCustomPricing: true,
      customPricingNote:
        'Pricing varies based on services required. Contact us for a custom quote.',
      category: 'CONCIERGE',
      isActive: true,
    },
  });

  console.log('Created packages:');
  console.log('- Starter Package:', starterPackage);
  console.log('- Premium Package:', premiumPackage);
  console.log('- Elite Gold Package:', eliteGoldPackage);
  console.log('- Passport Bachelor Experience:', passportBachelorPackage);

  console.log('Created add-ons:');
  console.log('- Background Verification:', backgroundVerification);
  console.log('- Elite TV Podcast Appearance:', eliteTvPodcast);
  console.log('- Personalized Concierge Services:', conciergeServices);

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
