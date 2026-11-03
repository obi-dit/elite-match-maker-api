import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getClients() {
    return await this.prisma.user.findMany({
      where: {
        role: 'USER',
        gender: 'MALE',
      },
      omit: { password: true },
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
      omit: { password: true },
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

  async getApplicants() {
    return await this.prisma.user.findMany({
      where: {
        gender: 'FEMALE',
        role: 'USER',
        isMembershipSubscribed: false,
      },
      omit: { password: true },
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
      omit: { password: true },
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
      data: { isApplicantApproved: isApproved },
    });
  }

  async getAllLikes() {
    return await this.prisma.likes.findMany({
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
          },
        },
        applicant: {
          select: {
            id: true,
            fullName: true,
            firstName: true,
            lastName: true,
            email: true,
            age: true,
            cityOfResidence: true,
            photo1: true,
            photo2: true,
            photo3: true,
            createdAt: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async getDashboardStats() {
    const [totalUsers, totalClients, totalApplicants, totalLikes, recentUsers] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'USER' } }),
        this.prisma.user.count({
          where: { isMembershipSubscribed: true, role: 'USER' },
        }),
        this.prisma.user.count({ where: { gender: 'FEMALE', role: 'USER' } }),
        this.prisma.likes.count(),
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
      ]);

    return {
      totalUsers,
      totalClients,
      totalApplicants,
      totalLikes,
      recentUsers,
    };
  }
}
