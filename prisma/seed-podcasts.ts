import { PrismaClient, PodcastStatus, PodcastType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPodcasts() {
  console.log('Seeding podcasts...');

  // Sample podcast data
  const podcasts = [
    {
      title: 'Dating Success Stories: Finding Love in the Digital Age',
      description:
        'Join us as we explore real success stories from our members who found love through our platform. Learn the secrets to successful online dating.',
      audioUrl: 'https://example.com/audio/dating-success-stories.mp3',
      videoUrl: 'https://example.com/video/dating-success-stories.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/dating-success.jpg',
      duration: 3600, // 1 hour
      status: PodcastStatus.PUBLISHED,
      type: PodcastType.RECORDED,
      isLive: false,
      categories: ['Success Stories', 'Dating Tips'],
    },
    {
      title: 'Live Q&A: Relationship Expert Answers Your Questions',
      description:
        'Our relationship expert answers your burning questions about love, dating, and relationships in this live interactive session.',
      audioUrl: 'https://example.com/audio/live-qa.mp3',
      videoUrl: 'https://example.com/video/live-qa.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/live-qa.jpg',
      duration: 2700, // 45 minutes
      status: PodcastStatus.LIVE,
      type: PodcastType.LIVE,
      isLive: true,
      categories: ['Live Q&A', 'Expert Advice'],
    },
    {
      title: 'Building Confidence: The Key to Dating Success',
      description:
        'Learn how to build unshakeable confidence that will transform your dating life. Practical tips and exercises included.',
      audioUrl: 'https://example.com/audio/confidence-building.mp3',
      videoUrl: 'https://example.com/video/confidence-building.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/confidence.jpg',
      duration: 2400, // 40 minutes
      status: PodcastStatus.PUBLISHED,
      type: PodcastType.RECORDED,
      isLive: false,
      categories: ['Self-Improvement', 'Confidence'],
    },
    {
      title: 'Premium Content: Advanced Dating Strategies',
      description:
        'Exclusive content for premium members. Advanced strategies for finding and maintaining meaningful relationships.',
      audioUrl: 'https://example.com/audio/premium-strategies.mp3',
      videoUrl: 'https://example.com/video/premium-strategies.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/premium.jpg',
      duration: 4200, // 70 minutes
      status: PodcastStatus.PUBLISHED,
      type: PodcastType.PREMIUM,
      isLive: false,
      categories: ['Premium Content', 'Advanced Strategies'],
    },
    {
      title: 'Upcoming: Live Dating Workshop',
      description:
        "Join us for an interactive dating workshop where you'll learn practical skills and get personalized advice.",
      audioUrl: null,
      videoUrl: null,
      thumbnailUrl: 'https://example.com/thumbnails/workshop.jpg',
      duration: 5400, // 90 minutes
      status: PodcastStatus.DRAFT,
      type: PodcastType.LIVE,
      isLive: false,
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      categories: ['Workshop', 'Live Event'],
    },
    {
      title: "Member Spotlight: Sarah's Journey to Love",
      description:
        'Hear from Sarah, one of our success stories, as she shares her journey from single to finding her perfect match.',
      audioUrl: 'https://example.com/audio/member-spotlight-sarah.mp3',
      videoUrl: 'https://example.com/video/member-spotlight-sarah.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/sarah-spotlight.jpg',
      duration: 1800, // 30 minutes
      status: PodcastStatus.PUBLISHED,
      type: PodcastType.RECORDED,
      isLive: false,
      categories: ['Member Spotlight', 'Success Stories'],
    },
    {
      title: 'Dating Red Flags: What to Watch Out For',
      description:
        'Learn to identify red flags early in relationships and protect yourself from toxic situations.',
      audioUrl: 'https://example.com/audio/red-flags.mp3',
      videoUrl: 'https://example.com/video/red-flags.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/red-flags.jpg',
      duration: 2100, // 35 minutes
      status: PodcastStatus.PUBLISHED,
      type: PodcastType.RECORDED,
      isLive: false,
      categories: ['Safety', 'Relationship Advice'],
    },
    {
      title: 'Live Stream: Weekly Dating Tips',
      description:
        'Join us every week for live dating tips, Q&A sessions, and community discussions.',
      audioUrl: 'https://example.com/audio/weekly-tips.mp3',
      videoUrl: 'https://example.com/video/weekly-tips.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/weekly-tips.jpg',
      duration: 1800, // 30 minutes
      status: PodcastStatus.ENDED,
      type: PodcastType.LIVE,
      isLive: false,
      categories: ['Weekly Tips', 'Community'],
    },
  ];

  for (const podcastData of podcasts) {
    const { categories, ...podcastInfo } = podcastData;

    const podcast = await prisma.podcast.create({
      data: {
        ...podcastInfo,
        podcastCategories: {
          create: categories.map((category) => ({
            category: category,
          })),
        },
      },
    });

    console.log(`Created podcast: ${podcast.title}`);
  }

  console.log('Podcast seeding completed!');
}

async function main() {
  try {
    await seedPodcasts();
  } catch (error) {
    console.error('Error seeding podcasts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedPodcasts };

