import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePodcastDto,
  UpdatePodcastDto,
  PodcastQueryDto,
} from './dto/podcast.dto';
import { PodcastStatus, PodcastType } from '@prisma/client';

@Injectable()
export class PodcastService {
  private readonly logger = new Logger(PodcastService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPodcast(createPodcastDto: CreatePodcastDto) {
    try {
      const podcast = await this.prisma.podcast.create({
        data: {
          title: createPodcastDto.title,
          description: createPodcastDto.description,
          audioUrl: createPodcastDto.audioUrl,
          videoUrl: createPodcastDto.videoUrl,
          thumbnailUrl: createPodcastDto.thumbnailUrl,
          duration: createPodcastDto.duration,
          status: createPodcastDto.status || PodcastStatus.DRAFT,
          type: createPodcastDto.type || PodcastType.RECORDED,
          scheduledAt: createPodcastDto.scheduledAt,
          streamKey: createPodcastDto.streamKey,
          isLive: createPodcastDto.isLive || false,
          podcastCategories: {
            create:
              createPodcastDto.categories?.map((category) => ({
                category: category,
              })) || [],
          },
        },
        include: {
          podcastCategories: true,
          podcastAccess: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      this.logger.log(`Created podcast: ${podcast.title}`);
      return podcast;
    } catch (error) {
      this.logger.error('Error creating podcast:', error);
      throw error;
    }
  }

  async findAllPodcasts(query: PodcastQueryDto) {
    try {
      const where: any = {};

      if (query.status) {
        where.status = query.status;
      }

      if (query.type) {
        where.type = query.type;
      }

      if (query.isLive !== undefined) {
        where.isLive = query.isLive;
      }

      if (query.category) {
        where.podcastCategories = {
          some: {
            category: {
              contains: query.category,
              mode: 'insensitive',
            },
          },
        };
      }

      const podcasts = await this.prisma.podcast.findMany({
        where,
        include: {
          podcastCategories: true,
          podcastAccess: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: query.skip || 0,
        take: query.take || 10,
      });

      return podcasts;
    } catch (error) {
      this.logger.error('Error fetching podcasts:', error);
      throw error;
    }
  }

  async findPodcastById(id: number) {
    try {
      const podcast = await this.prisma.podcast.findUnique({
        where: { id },
        include: {
          podcastCategories: true,
          podcastAccess: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      if (!podcast) {
        throw new NotFoundException(`Podcast with ID ${id} not found`);
      }

      return podcast;
    } catch (error) {
      this.logger.error(`Error fetching podcast ${id}:`, error);
      throw error;
    }
  }

  async updatePodcast(id: number, updatePodcastDto: UpdatePodcastDto) {
    try {
      const existingPodcast = await this.findPodcastById(id);

      const podcast = await this.prisma.podcast.update({
        where: { id },
        data: {
          title: updatePodcastDto.title,
          description: updatePodcastDto.description,
          audioUrl: updatePodcastDto.audioUrl,
          videoUrl: updatePodcastDto.videoUrl,
          thumbnailUrl: updatePodcastDto.thumbnailUrl,
          duration: updatePodcastDto.duration,
          status: updatePodcastDto.status,
          type: updatePodcastDto.type,
          scheduledAt: updatePodcastDto.scheduledAt,
          streamKey: updatePodcastDto.streamKey,
          isLive: updatePodcastDto.isLive,
          ...(updatePodcastDto.categories && {
            podcastCategories: {
              deleteMany: {},
              create: updatePodcastDto.categories.map((category) => ({
                category: category,
              })),
            },
          }),
        },
        include: {
          podcastCategories: true,
          podcastAccess: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      this.logger.log(`Updated podcast: ${podcast.title}`);
      return podcast;
    } catch (error) {
      this.logger.error(`Error updating podcast ${id}:`, error);
      throw error;
    }
  }

  async deletePodcast(id: number) {
    try {
      const existingPodcast = await this.findPodcastById(id);

      await this.prisma.podcast.delete({
        where: { id },
      });

      this.logger.log(`Deleted podcast: ${existingPodcast.title}`);
      return { message: 'Podcast deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting podcast ${id}:`, error);
      throw error;
    }
  }

  async getMemberDashboard(userId: number) {
    try {
      // Get user's subscription status
      const userSubscription = await this.prisma.userSubscription.findFirst({
        where: {
          userId: userId,
          status: 'ACTIVE',
        },
        include: {
          subscription: {
            include: {
              subscriptionFeatures: {
                include: {
                  feature: true,
                },
              },
            },
          },
        },
      });

      // Get new recorded podcasts (published in last 7 days)
      const newRecordedPodcasts = await this.prisma.podcast.findMany({
        where: {
          status: PodcastStatus.PUBLISHED,
          type: PodcastType.RECORDED,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        include: {
          podcastCategories: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      });

      // Get previous podcasts (older than 7 days)
      const previousPodcasts = await this.prisma.podcast.findMany({
        where: {
          status: PodcastStatus.PUBLISHED,
          type: PodcastType.RECORDED,
          createdAt: {
            lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Older than 7 days
          },
        },
        include: {
          podcastCategories: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      });

      // Get live podcasts (currently live or scheduled)
      const livePodcasts = await this.prisma.podcast.findMany({
        where: {
          OR: [
            { isLive: true },
            {
              status: PodcastStatus.LIVE,
              scheduledAt: {
                gte: new Date(), // Future scheduled live podcasts
              },
            },
          ],
        },
        include: {
          podcastCategories: true,
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      });

      // Get user's accessed podcasts
      const userAccess = await this.prisma.podcastAccess.findMany({
        where: {
          userId: userId,
        },
        include: {
          podcast: {
            include: {
              podcastCategories: true,
            },
          },
        },
        orderBy: {
          accessedAt: 'desc',
        },
        take: 10,
      });

      return {
        userSubscription,
        newRecordedPodcasts,
        previousPodcasts,
        livePodcasts,
        recentlyAccessed: userAccess.map((access) => access.podcast),
      };
    } catch (error) {
      this.logger.error(
        `Error getting member dashboard for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async recordPodcastAccess(userId: number, podcastId: number) {
    try {
      // Check if user has access to this podcast
      const userSubscription = await this.prisma.userSubscription.findFirst({
        where: {
          userId: userId,
          status: 'ACTIVE',
        },
      });

      if (!userSubscription) {
        throw new ForbiddenException(
          'User does not have an active subscription',
        );
      }

      // Record access
      await this.prisma.podcastAccess.upsert({
        where: {
          podcastId_userId: {
            podcastId: podcastId,
            userId: userId,
          },
        },
        update: {
          accessedAt: new Date(),
        },
        create: {
          podcastId: podcastId,
          userId: userId,
          accessedAt: new Date(),
        },
      });

      // Increment view count
      await this.prisma.podcast.update({
        where: { id: podcastId },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

      this.logger.log(
        `Recorded access for user ${userId} to podcast ${podcastId}`,
      );
      return { message: 'Access recorded successfully' };
    } catch (error) {
      this.logger.error(`Error recording podcast access:`, error);
      throw error;
    }
  }

  async startLiveStream(podcastId: number) {
    try {
      const podcast = await this.prisma.podcast.update({
        where: { id: podcastId },
        data: {
          isLive: true,
          status: PodcastStatus.LIVE,
        },
      });

      this.logger.log(`Started live stream for podcast: ${podcast.title}`);
      return podcast;
    } catch (error) {
      this.logger.error(
        `Error starting live stream for podcast ${podcastId}:`,
        error,
      );
      throw error;
    }
  }

  async endLiveStream(podcastId: number) {
    try {
      const podcast = await this.prisma.podcast.update({
        where: { id: podcastId },
        data: {
          isLive: false,
          status: PodcastStatus.ENDED,
        },
      });

      this.logger.log(`Ended live stream for podcast: ${podcast.title}`);
      return podcast;
    } catch (error) {
      this.logger.error(
        `Error ending live stream for podcast ${podcastId}:`,
        error,
      );
      throw error;
    }
  }
}

