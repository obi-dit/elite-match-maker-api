import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Add-On Services...');

  // Create Background Verification Add-On
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

  // Create Elite TV Podcast Appearance Add-On
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

  // Create Personalized Concierge Services Add-On
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

  console.log('Created Add-On Services:');
  console.log('- Background Verification:', backgroundVerification);
  console.log('- Elite TV Podcast Appearance:', eliteTvPodcast);
  console.log('- Personalized Concierge Services:', conciergeServices);

  console.log('Add-On seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
