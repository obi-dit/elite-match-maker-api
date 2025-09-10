import { PrismaClient, FeatureCategory, TierEnum } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedFeatures() {
  console.log('🌱 Starting seedFeatures function...');
  console.log('🌱 Seeding features and tier relationships...');

  // Check if features already exist
  const existingFeaturesCount = await prisma.feature.count();
  if (existingFeaturesCount > 0) {
    console.log(
      `⚠️  Features already exist (${existingFeaturesCount} found). Skipping feature creation.`,
    );
  } else {
    console.log('📝 Creating features...');
    // Create features
    const features = [
      // Content Features
      {
        name: 'Full-length podcast episodes',
        description: 'Uncut interviews and challenges from the show',
        category: FeatureCategory.CONTENT,
      },
      {
        name: 'Behind-the-scenes content',
        description: 'Daily vlog style clips of models preparing and chatting',
        category: FeatureCategory.CONTENT,
      },
      {
        name: 'Weekly member-exclusive content',
        description: 'Special content only available to members',
        category: FeatureCategory.CONTENT,
      },

      // Community Features
      {
        name: 'Member-only community access',
        description: 'Discord/WhatsApp groups moderated by brand model hosts',
        category: FeatureCategory.COMMUNITY,
      },
      {
        name: 'Q&A livestreams',
        description: 'Access to live Q&A sessions with models',
        category: FeatureCategory.COMMUNITY,
      },
      {
        name: 'Virtual Dating Challenge voting',
        description: 'Monthly voting on which model wins challenges',
        category: FeatureCategory.COMMUNITY,
      },

      // Interaction Features
      {
        name: 'Live question priority',
        description: 'Priority for asking questions during podcasts',
        category: FeatureCategory.INTERACTION,
      },
      {
        name: 'Virtual speed dates',
        description: '5-10 minute video calls with pre-screened models',
        category: FeatureCategory.INTERACTION,
      },
      {
        name: 'Exclusive model interactions',
        description: 'Direct interaction opportunities with models',
        category: FeatureCategory.INTERACTION,
      },

      // Matchmaking Features
      {
        name: 'First access to matchmaking services',
        description: 'Priority access to apply for matchmaking',
        category: FeatureCategory.MATCHMAKING,
      },
      {
        name: 'Direct model introductions',
        description: 'Direct introductions to serious model applicants',
        category: FeatureCategory.MATCHMAKING,
      },
      {
        name: 'Elite Matchmaker consultation',
        description: 'One-on-one consultation with Elite Matchmaker',
        category: FeatureCategory.MATCHMAKING,
      },

      // Concierge Features
      {
        name: 'Villa event invites',
        description: 'Exclusive villa event invites in Colombia',
        category: FeatureCategory.CONCIERGE,
      },
      {
        name: 'Personalized matchmaking strategy',
        description: 'Custom strategy for finding your perfect match',
        category: FeatureCategory.CONCIERGE,
      },
      {
        name: '24/7 concierge service',
        description: 'Round-the-clock concierge support',
        category: FeatureCategory.CONCIERGE,
      },

      // Verification Features
      {
        name: 'Background verification',
        description: 'Verified background checks for safety',
        category: FeatureCategory.VERIFICATION,
      },

      // Media Features
      {
        name: 'Elite TV Podcast appearance',
        description: 'Featured introduction reel on Elite TV',
        category: FeatureCategory.MEDIA,
      },
    ];

    console.log('📝 Creating features...');
    for (const featureData of features) {
      await prisma.feature.upsert({
        where: { name: featureData.name },
        update: featureData,
        create: featureData,
      });
    }
  }

  // Get all features for tier assignment
  const allFeatures = await prisma.feature.findMany();

  // Define tier-feature relationships
  const tierFeatures = [
    // Bronze Tier Features
    {
      tier: TierEnum.BRONZE,
      price: 19.0,
      isActive: true,
      features: [
        'Full-length podcast episodes',
        'Member-only community access',
        'Q&A livestreams',
        'Weekly member-exclusive content',
      ],
    },

    // Silver Tier Features (includes all Bronze + additional)
    {
      tier: TierEnum.SILVER,
      price: 69.0,
      isActive: true,
      features: [
        'Full-length podcast episodes',
        'Member-only community access',
        'Q&A livestreams',
        'Weekly member-exclusive content',
        'Behind-the-scenes content',
        'Live question priority',
        'Virtual Dating Challenge voting',
        'Exclusive model interactions',
      ],
    },

    // Gold Tier Features (includes all Silver + additional)
    {
      tier: TierEnum.GOLD,
      price: 249.0,
      isActive: true,
      features: [
        'Full-length podcast episodes',
        'Member-only community access',
        'Q&A livestreams',
        'Weekly member-exclusive content',
        'Behind-the-scenes content',
        'Live question priority',
        'Virtual Dating Challenge voting',
        'Exclusive model interactions',
        'Virtual speed dates',
        'First access to matchmaking services',
        'Background verification',
      ],
    },

    // Elite VIP Tier Features (includes all Gold + additional)
    {
      tier: TierEnum.ELITEVIP,
      price: 1499.0,
      isActive: true,
      features: [
        'Full-length podcast episodes',
        'Member-only community access',
        'Q&A livestreams',
        'Weekly member-exclusive content',
        'Behind-the-scenes content',
        'Live question priority',
        'Virtual Dating Challenge voting',
        'Exclusive model interactions',
        'Virtual speed dates',
        'First access to matchmaking services',
        'Background verification',
        'Direct model introductions',
        'Elite Matchmaker consultation',
        'Villa event invites',
        'Personalized matchmaking strategy',
        '24/7 concierge service',
        'Elite TV Podcast appearance',
      ],
    },
  ];

  console.log('🔗 Creating subscriptions and tier-feature relationships...');
  for (const tierData of tierFeatures) {
    // First create the subscription tier (check if it already exists)
    let subscription = await prisma.subscription.findUnique({
      where: {
        tier: tierData.tier,
      },
    });

    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          tier: tierData.tier,
          price: tierData.price,
          isActive: tierData.isActive,
        },
      });
    }

    // Then create the subscription-feature relationships
    for (const featureName of tierData.features) {
      const feature = allFeatures.find((f) => f.name === featureName);
      if (feature) {
        // Check if relationship already exists to avoid duplicates
        const existingRelationship =
          await prisma.subscriptionFeature.findUnique({
            where: {
              subscriptionId_featureId: {
                subscriptionId: subscription.id,
                featureId: feature.id,
              },
            },
          });
        console.log('Existing relationship:', existingRelationship);
        console.log('Subscription ID:', subscription.id);
        console.log('Feature ID:', feature.id);
        console.log('Feature Name:', feature.name);

        if (!existingRelationship) {
          console.log('Creating subscription feature relationship...');
          console.log(
            'Subscription ID:',
            subscription,
            'Feature ID:',
            feature,
            'Feature Name:',
            feature.name,
          );
          await prisma.subscriptionFeature.create({
            data: {
              subscriptionId: subscription.id,
              featureId: feature.id,
            },
          });
        }
      }
    }
  }

  console.log(
    '✅ Features and subscription relationships seeded successfully!',
  );

  // Display summary
  const featureCount = await prisma.feature.count();
  const subscriptionCount = await prisma.subscription.count();
  const subscriptionFeatureCount = await prisma.subscriptionFeature.count();

  console.log(`📊 Summary:`);
  console.log(`   - Features created: ${featureCount}`);
  console.log(`   - Subscriptions created: ${subscriptionCount}`);
  console.log(
    `   - Subscription-feature relationships: ${subscriptionFeatureCount}`,
  );

  // Display features by category
  const featuresByCategory = await prisma.feature.groupBy({
    by: ['category'],
    _count: { id: true },
  });

  console.log(`\n📂 Features by category:`);
  featuresByCategory.forEach((cat) => {
    console.log(`   - ${cat.category}: ${cat._count.id} features`);
  });
}

seedFeatures()
  .catch((e) => {
    console.error('❌ Error seeding features:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
