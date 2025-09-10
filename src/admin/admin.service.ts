import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePodcastDto } from '../podcast/dto/podcast.dto';
import { UpdatePodcastDto } from '../podcast/dto/podcast.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // Podcast Management
  async createPodcast(createPodcastDto: CreatePodcastDto) {
    const { categories, ...podcastData } = createPodcastDto;

    return await this.prisma.podcast.create({
      data: {
        ...podcastData,
        podcastCategories: {
          create: categories?.map((category) => ({ category })) || [],
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
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async uploadPodcast(createPodcastDto: any, files: Express.Multer.File[]) {
    const { categories, ...podcastData } = createPodcastDto;

    // Handle file uploads
    let audioUrl, videoUrl, thumbnailUrl;

    if (files && files.length > 0) {
      files.forEach((file) => {
        const fileUrl = `/uploads/${file.filename}`;

        if (file.mimetype.startsWith('audio/')) {
          audioUrl = fileUrl;
        } else if (file.mimetype.startsWith('video/')) {
          videoUrl = fileUrl;
        } else if (file.mimetype.startsWith('image/')) {
          thumbnailUrl = fileUrl;
        }
      });
    }

    return await this.prisma.podcast.create({
      data: {
        ...podcastData,
        audioUrl,
        videoUrl,
        thumbnailUrl,
        podcastCategories: {
          create: categories?.map((category) => ({ category })) || [],
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
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async updatePodcast(id: number, updatePodcastDto: UpdatePodcastDto) {
    const { categories, ...podcastData } = updatePodcastDto;

    // Check if podcast exists
    const existingPodcast = await this.prisma.podcast.findUnique({
      where: { id },
    });

    if (!existingPodcast) {
      throw new NotFoundException('Podcast not found');
    }

    // Update podcast
    const updatedPodcast = await this.prisma.podcast.update({
      where: { id },
      data: podcastData,
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
                email: true,
              },
            },
          },
        },
      },
    });

    // Update categories if provided
    if (categories) {
      // Delete existing categories
      await this.prisma.podcastCategory.deleteMany({
        where: { podcastId: id },
      });

      // Create new categories
      await this.prisma.podcastCategory.createMany({
        data: categories.map((category) => ({
          podcastId: id,
          category,
        })),
      });
    }

    return updatedPodcast;
  }

  async deletePodcast(id: number) {
    const podcast = await this.prisma.podcast.findUnique({
      where: { id },
    });

    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }

    return await this.prisma.podcast.delete({
      where: { id },
    });
  }

  async getAllPodcasts() {
    return await this.prisma.podcast.findMany({
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
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPodcastById(id: number) {
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
                email: true,
              },
            },
          },
        },
      },
    });

    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }

    return podcast;
  }

  // Client Management (Users with subscriptions)
  async getClients() {
    return await this.prisma.user.findMany({
      where: {
        isMembershipSubscribed: false,
        role: 'USER',
        gender: 'MALE',
      },
      include: {
        userSubscription: {
          include: {
            subscription: true,
          },
        },
        transactions: {
          where: {
            status: 'PAID',
          },
          include: {
            package: true,
            subscription: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getClientById(id: number) {
    const client = await this.prisma.user.findUnique({
      where: {
        id,
        isMembershipSubscribed: true,
        role: 'USER',
      },
      include: {
        userSubscription: {
          include: {
            subscription: true,
          },
        },
        transactions: {
          where: {
            status: 'PAID',
          },
          include: {
            package: true,
            subscription: true,
          },
        },
        podcastAccess: {
          include: {
            podcast: {
              select: {
                id: true,
                title: true,
                status: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async updateClientStatus(id: number, isActive: boolean) {
    const client = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return await this.prisma.user.update({
      where: { id },
      data: { isMembershipSubscribed: isActive },
    });
  }

  // Applicant Management (Women who applied)
  async getApplicants() {
    return await this.prisma.user.findMany({
      where: {
        gender: 'FEMALE',
        role: 'USER',
        isMembershipSubscribed: false,
      },
      include: {
        userSubscription: {
          include: {
            subscription: true,
          },
        },
        transactions: {
          where: {
            status: 'PAID',
          },
          include: {
            package: true,
            subscription: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getApplicantById(id: number) {
    const applicant = await this.prisma.user.findUnique({
      where: {
        id,
        gender: 'FEMALE',
        role: 'USER',
      },
      include: {
        userSubscription: {
          include: {
            subscription: true,
          },
        },
        transactions: {
          where: {
            status: 'PAID',
          },
          include: {
            package: true,
            subscription: true,
          },
        },
        podcastAccess: {
          include: {
            podcast: {
              select: {
                id: true,
                title: true,
                status: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!applicant) {
      throw new NotFoundException('Applicant not found');
    }

    return applicant;
  }

  async updateApplicantStatus(id: number, isApproved: boolean) {
    const applicant = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!applicant) {
      throw new NotFoundException('Applicant not found');
    }

    return await this.prisma.user.update({
      where: { id },
      data: { isMembershipSubscribed: isApproved },
    });
  }

  // Dashboard Statistics
  async getDashboardStats() {
    const [
      totalUsers,
      totalClients,
      totalApplicants,
      totalPodcasts,
      recentUsers,
      recentPodcasts,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.user.count({
        where: { isMembershipSubscribed: true, role: 'USER' },
      }),
      this.prisma.user.count({ where: { gender: 'FEMALE', role: 'USER' } }),
      this.prisma.podcast.count(),
      this.prisma.user.findMany({
        where: { role: 'USER' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          isMembershipSubscribed: true,
        },
      }),
      this.prisma.podcast.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          podcastCategories: true,
        },
      }),
    ]);

    console.log(
      totalUsers,
      totalClients,
      totalApplicants,
      totalPodcasts,
      recentUsers,
      recentPodcasts,
    );

    return {
      totalUsers,
      totalClients,
      totalApplicants,
      totalPodcasts,
      recentUsers,
      recentPodcasts,
    };
  }
}
