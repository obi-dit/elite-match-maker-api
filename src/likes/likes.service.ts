import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLike(clientId: number, applicantId: number) {
    return this.prismaService.likes.create({
      data: { clientId, applicantId },
    });
  }

  async getLikedApplicants(clientId: number) {
    const likes = await this.prismaService.likes.findMany({
      where: { clientId },
      include: {
        applicant: true,
      },
      orderBy: { id: 'desc' },
    });

    const likeData = likes.map((like) => ({
      ...like,
      applicant: {
        ...like.applicant,
        password: undefined,
      },
    }));

    return likeData;
  }

  async unlikeApplicant(id: number) {
    try {
      const like = await this.prismaService.likes.findUnique({
        where: {
          id,
        },
      });

      if (!like) {
        throw new NotFoundException('Like not found');
      }

      return this.prismaService.likes.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new NotFoundException('Like not found');
    }
  }
}
